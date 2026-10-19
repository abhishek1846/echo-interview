export interface ConversationTurn {
  id: string;
  role: 'agent' | 'user';
  text: string;
  timestamp: string;
}

export interface SentimentResult {
  text: string;
  start: number;
  end: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  confidence: number;
  speaker?: string | null;
}

export interface DetectedEntity {
  text: string;
  entity_type: string;
}

export interface SpeakerUtterance {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

export interface MomTestTakeaways {
  task_attempted: string;
  friction_points: string[];
  user_workarounds: string[];
  sentiment_summary: {
    positive: number;
    neutral: number;
    negative: number;
    overall: 'Positive' | 'Neutral' | 'Frustrated';
  };
  key_quotes: {
    quote: string;
    timestamp: string;
    type: 'friction' | 'praise' | 'workaround';
  }[];
}

export interface InterviewRecord {
  id: string;
  created_at: string;
  duration_seconds: number;
  user_id?: string;
  product_name: string;
  audio_url?: string;
  transcript_text: string;
  summary: string;
  utterances: SpeakerUtterance[];
  sentiment_results: SentimentResult[];
  entities: DetectedEntity[];
  mom_test: MomTestTakeaways;
  turns?: ConversationTurn[];
}
