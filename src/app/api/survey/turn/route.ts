import { NextRequest, NextResponse } from 'next/server';
import { ConversationTurn, InterviewRecord, SentimentResult, DetectedEntity, SpeakerUtterance, MomTestTakeaways } from '@/lib/types';
import { saveInterview } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName = 'Kroma Audio', history = [], userMessage } = body;

    const turns: ConversationTurn[] = [...history];

    if (userMessage) {
      turns.push({
        id: `turn_u_${Date.now()}`,
        role: 'user',
        text: userMessage,
        timestamp: new Date().toISOString(),
      });
    }

    const userTurnCount = turns.filter((t) => t.role === 'user').length;
    let agentReply = '';
    let isComplete = false;

    if (userTurnCount === 0) {
      // Turn 1: Opening prompt
      agentReply = `Hi! Thanks for taking 90 seconds to chat with ${productName}. What was the main gear or product you were looking to buy or configure today?`;
    } else if (userTurnCount === 1) {
      // Turn 2: Friction Probe (Mom Test rule: don't parrot, ask about exact hesitation)
      agentReply = "Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?";
    } else if (userTurnCount === 2) {
      // Turn 3: Workaround Probe
      agentReply = "When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?";
    } else {
      // Turn 4: Wrap-up
      agentReply = "That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!";
      isComplete = true;
    }

    const agentTurn: ConversationTurn = {
      id: `turn_a_${Date.now()}`,
      role: 'agent',
      text: agentReply,
      timestamp: new Date().toISOString(),
    };

    turns.push(agentTurn);

    let createdRecordId: string | null = null;

    // If survey is complete, synthesize qualitative record
    if (isComplete) {
      const userUtterances = turns.filter((t) => t.role === 'user');
      const fullTranscript = turns.map((t) => `${t.role === 'agent' ? 'Echo' : 'Customer'}: ${t.text}`).join('\n');

      const utterances: SpeakerUtterance[] = turns.map((t, idx) => ({
        speaker: t.role === 'agent' ? 'Echo (AI)' : 'Customer',
        start: idx * 12000,
        end: (idx + 1) * 12000,
        text: t.text,
      }));

      // Extract negative sentiment signals
      const frictionPoints: string[] = [];
      const userWorkarounds: string[] = [];
      const sentimentResults: SentimentResult[] = [];
      const entities: DetectedEntity[] = [];

      for (let i = 0; i < userUtterances.length; i++) {
        const u = userUtterances[i];
        if (i === 1) {
          frictionPoints.push(u.text);
          sentimentResults.push({
            text: u.text,
            start: (i + 1) * 12000,
            end: (i + 2) * 12000,
            sentiment: 'NEGATIVE',
            confidence: 0.91,
            speaker: 'Customer',
          });
        } else if (i === 2) {
          userWorkarounds.push(u.text);
          sentimentResults.push({
            text: u.text,
            start: (i + 1) * 12000,
            end: (i + 2) * 12000,
            sentiment: 'NEUTRAL',
            confidence: 0.84,
            speaker: 'Customer',
          });
        } else {
          sentimentResults.push({
            text: u.text,
            start: (i + 1) * 12000,
            end: (i + 2) * 12000,
            sentiment: 'POSITIVE',
            confidence: 0.88,
            speaker: 'Customer',
          });
        }
      }

      // Basic entity parsing
      const words = fullTranscript.split(/\s+/);
      const potentialEntities = ['Model-1', 'DAC-Mini', 'Toronto', 'Reddit', 'cables', 'checkout', 'shipping', 'Canada', 'Mac', 'USB-C', 'cushions'];
      for (const ent of potentialEntities) {
        if (fullTranscript.toLowerCase().includes(ent.toLowerCase())) {
          entities.push({
            text: ent,
            entity_type: ent.includes('Model') || ent.includes('DAC') ? 'product' : 'concept',
          });
        }
      }

      const momTest: MomTestTakeaways = {
        task_attempted: userUtterances[0]?.text || `Interacting with ${productName}`,
        friction_points: frictionPoints.length > 0 ? frictionPoints : ['No major friction points stated'],
        user_workarounds: userWorkarounds.length > 0 ? userWorkarounds : ['No workaround reported'],
        sentiment_summary: {
          positive: 1,
          neutral: 1,
          negative: frictionPoints.length,
          overall: frictionPoints.length > 0 ? 'Frustrated' : 'Neutral',
        },
        key_quotes: userUtterances.map((u, idx) => ({
          quote: u.text,
          timestamp: `00:${((idx + 1) * 14).toString().padStart(2, '0')}`,
          type: idx === 1 ? 'friction' : idx === 2 ? 'workaround' : 'praise',
        })),
      };

      const recordId = `intv_live_${Date.now()}`;
      createdRecordId = recordId;

      const record: InterviewRecord = {
        id: recordId,
        created_at: new Date().toISOString(),
        duration_seconds: turns.length * 12,
        product_name: productName,
        transcript_text: fullTranscript,
        summary: `- User was attempting to: "${userUtterances[0]?.text || 'N/A'}"\n- Point of friction identified: "${userUtterances[1]?.text || 'None'}"\n- User workaround resorted to: "${userUtterances[2]?.text || 'None'}"`,
        utterances,
        sentiment_results: sentimentResults,
        entities,
        mom_test: momTest,
        turns,
      };

      saveInterview(record);
    }

    return NextResponse.json({
      agentReply,
      turns,
      isComplete,
      recordId: createdRecordId,
    });
  } catch (err: unknown) {
    console.error('Error in survey turn handler:', err);
    return NextResponse.json({ error: 'Failed to process turn' }, { status: 500 });
  }
}
