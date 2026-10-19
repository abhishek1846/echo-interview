import { AssemblyAI } from 'assemblyai';
import { InterviewRecord, SentimentResult, DetectedEntity, SpeakerUtterance, MomTestTakeaways } from './types';

const apiKey = process.env.ASSEMBLYAI_API_KEY || '8e829de11fe94ac19b4d894419e025cc';
const client = new AssemblyAI({ apiKey });

export async function processAudioWithAssemblyAI(
  audioBuffer: Buffer,
  productName: string = 'Kroma Audio'
): Promise<InterviewRecord> {
  // 1. Upload audio buffer directly to AssemblyAI
  console.log('[AssemblyAI] Uploading audio buffer (bytes:', audioBuffer.length, ')...');
  const uploadUrl = await client.files.upload(audioBuffer);
  console.log('[AssemblyAI] File uploaded successfully:', uploadUrl);

  // 2. Transcribe with Speech Intelligence
  console.log('[AssemblyAI] Transcribing with Speech Intelligence...');
  const transcript = await client.transcripts.transcribe({
    audio: uploadUrl,
    summarization: true,
    summary_model: 'informative',
    summary_type: 'bullets',
    sentiment_analysis: true,
    entity_detection: true,
    speaker_labels: true,
  });

  if (transcript.status === 'error') {
    throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
  }

  // 3. Map Utterances
  const utterances: SpeakerUtterance[] = (transcript.utterances || []).map((u) => ({
    speaker: u.speaker,
    start: u.start,
    end: u.end,
    text: u.text,
  }));

  // 4. Map Sentiment
  const sentimentResults: SentimentResult[] = (transcript.sentiment_analysis_results || []).map((s) => ({
    text: s.text,
    start: s.start,
    end: s.end,
    sentiment: s.sentiment as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE',
    confidence: s.confidence,
    speaker: s.speaker || null,
  }));

  // 5. Map Entities
  const entities: DetectedEntity[] = (transcript.entities || []).map((e) => ({
    text: e.text,
    entity_type: e.entity_type,
  }));

  // 6. Generate Mom-Test Qualitative Takeaways
  const negativeUtterances = sentimentResults.filter((s) => s.sentiment === 'NEGATIVE');
  const positiveUtterances = sentimentResults.filter((s) => s.sentiment === 'POSITIVE');
  const neutralUtterances = sentimentResults.filter((s) => s.sentiment === 'NEUTRAL');

  const frictionPoints: string[] = [];
  const workarounds: string[] = [];
  const keyQuotes: MomTestTakeaways['key_quotes'] = [];

  for (const neg of negativeUtterances) {
    frictionPoints.push(neg.text);
    const mm = Math.floor(neg.start / 60000).toString().padStart(2, '0');
    const ss = Math.floor((neg.start % 60000) / 1000).toString().padStart(2, '0');
    keyQuotes.push({
      quote: neg.text,
      timestamp: `${mm}:${ss}`,
      type: 'friction',
    });
  }

  // Look for workaround trigger words in transcript
  const workaroundRegex = /(ended up|had to|workaround|instead|manually|resorted to|switched to)/i;
  for (const utt of utterances) {
    if (workaroundRegex.test(utt.text)) {
      workarounds.push(utt.text);
      const mm = Math.floor(utt.start / 60000).toString().padStart(2, '0');
      const ss = Math.floor((utt.start % 60000) / 1000).toString().padStart(2, '0');
      keyQuotes.push({
        quote: utt.text,
        timestamp: `${mm}:${ss}`,
        type: 'workaround',
      });
    }
  }

  // Calculate overall sentiment
  let overallSentiment: 'Positive' | 'Neutral' | 'Frustrated' = 'Neutral';
  if (negativeUtterances.length > positiveUtterances.length) {
    overallSentiment = 'Frustrated';
  } else if (positiveUtterances.length > negativeUtterances.length) {
    overallSentiment = 'Positive';
  }

  const durationSec = Math.round((transcript.audio_duration || 0));

  const momTest: MomTestTakeaways = {
    task_attempted: `Using ${productName}`,
    friction_points: frictionPoints.length > 0 ? frictionPoints : ['No major friction points reported'],
    user_workarounds: workarounds.length > 0 ? workarounds : ['None required or reported'],
    sentiment_summary: {
      positive: positiveUtterances.length,
      neutral: neutralUtterances.length,
      negative: negativeUtterances.length,
      overall: overallSentiment,
    },
    key_quotes: keyQuotes.slice(0, 5),
  };

  const id = `intv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    created_at: new Date().toISOString(),
    duration_seconds: durationSec || 45,
    product_name: productName,
    transcript_text: transcript.text || '',
    summary: transcript.summary || 'Summary unavailable',
    utterances,
    sentiment_results: sentimentResults,
    entities,
    mom_test: momTest,
  };
}
