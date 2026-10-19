import fs from 'fs';
import path from 'path';
import { InterviewRecord } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'interviews.json');

const CONSUMER_SAMPLES: InterviewRecord[] = [
  {
    id: 'intv_kroma_01',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    duration_seconds: 72,
    product_name: 'Kroma Audio',
    transcript_text: 'I was on your checkout page trying to order the Model-1 headphones and the extra leather ear cushions. When I added my address in Toronto, the shipping options did not show whether import customs and duties were included. I hesitated because with international audio gear, surprise duties can be another fifty dollars at the door. I ended up opening Reddit on my phone to search if anyone in Canada had ordered from Kroma before. Did not find an answer, so I left the cart open.',
    summary: '- Shopper attempted to purchase the Model-1 headphones and leather ear cushions to Toronto, Canada.\n- Hesitated and abandoned checkout because duties and import taxes were not calculated at checkout.\n- Searched Reddit on mobile as an unprompted workaround before abandoning the cart.',
    utterances: [
      {
        speaker: 'A',
        start: 0,
        end: 11000,
        text: 'I was on your checkout page trying to order the Model-1 headphones and the extra leather ear cushions.'
      },
      {
        speaker: 'A',
        start: 11500,
        end: 24000,
        text: 'When I added my address in Toronto, the shipping options did not show whether import customs and duties were included.'
      },
      {
        speaker: 'A',
        start: 24500,
        end: 34000,
        text: 'I hesitated because with international audio gear, surprise duties can be another fifty dollars at the door.'
      },
      {
        speaker: 'A',
        start: 34500,
        end: 46000,
        text: 'I ended up opening Reddit on my phone to search if anyone in Canada had ordered from Kroma before. Did not find an answer, so I left the cart open.'
      }
    ],
    sentiment_results: [
      { text: 'I was on your checkout page trying to order the Model-1 headphones and the extra leather ear cushions.', start: 0, end: 11000, sentiment: 'NEUTRAL', confidence: 0.95 },
      { text: 'When I added my address in Toronto, the shipping options did not show whether import customs and duties were included.', start: 11500, end: 24000, sentiment: 'NEGATIVE', confidence: 0.89 },
      { text: 'I hesitated because with international audio gear, surprise duties can be another fifty dollars at the door.', start: 24500, end: 34000, sentiment: 'NEGATIVE', confidence: 0.92 },
      { text: 'I ended up opening Reddit on my phone to search if anyone in Canada had ordered from Kroma before.', start: 34500, end: 41000, sentiment: 'NEGATIVE', confidence: 0.78 },
      { text: 'Did not find an answer, so I left the cart open.', start: 41500, end: 46000, sentiment: 'NEGATIVE', confidence: 0.91 }
    ],
    entities: [
      { text: 'Model-1', entity_type: 'product' },
      { text: 'Toronto', entity_type: 'location' },
      { text: 'Reddit', entity_type: 'organization' },
      { text: 'Kroma', entity_type: 'organization' }
    ],
    mom_test: {
      task_attempted: 'Completing checkout for Model-1 headphones with international shipping to Canada',
      friction_points: [
        'Shipping calculator failed to specify if customs/import taxes were prepaid or collected at door',
        'Fear of surprise $50 customs fees caused immediate purchase hesitation'
      ],
      user_workarounds: [
        'Opened Reddit on mobile to search past buyer delivery experiences',
        'Abandoned the checkout cart when no confirmation was found'
      ],
      sentiment_summary: {
        positive: 0,
        neutral: 1,
        negative: 4,
        overall: 'Frustrated'
      },
      key_quotes: [
        { quote: 'The shipping options did not show whether import customs and duties were included.', timestamp: '00:12', type: 'friction' },
        { quote: 'I ended up opening Reddit on my phone to search if anyone in Canada had ordered from Kroma before.', timestamp: '00:35', type: 'workaround' },
        { quote: 'Did not find an answer, so I left the cart open.', timestamp: '00:41', type: 'friction' }
      ]
    }
  },
  {
    id: 'intv_kroma_02',
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    duration_seconds: 58,
    product_name: 'Kroma Audio',
    transcript_text: 'The unboxing of the DAC-Mini was incredible, but when I paired it with my Mac, the sample rate defaulted to 44.1 kilohertz instead of high-res 192k. I had to go into Audio MIDI Setup in macOS to manually toggle the bitrate. A card in the box explaining that macOS requires a manual switch for lossless would have saved me thirty minutes of troubleshooting.',
    summary: '- Customer praised the physical unboxing experience of the DAC-Mini.\n- Experienced confusion when macOS defaulted sample rate to 44.1kHz instead of advertised 192kHz.\n- Had to manually configure macOS Audio MIDI Setup as a workaround.',
    utterances: [
      {
        speaker: 'A',
        start: 0,
        end: 9000,
        text: 'The unboxing of the DAC-Mini was incredible, but when I paired it with my Mac, the sample rate defaulted to 44.1 kilohertz instead of high-res 192k.'
      },
      {
        speaker: 'A',
        start: 9500,
        end: 18000,
        text: 'I had to go into Audio MIDI Setup in macOS to manually toggle the bitrate.'
      },
      {
        speaker: 'A',
        start: 18500,
        end: 32000,
        text: 'A card in the box explaining that macOS requires a manual switch for lossless would have saved me thirty minutes of troubleshooting.'
      }
    ],
    sentiment_results: [
      { text: 'The unboxing of the DAC-Mini was incredible.', start: 0, end: 4000, sentiment: 'POSITIVE', confidence: 0.96 },
      { text: 'The sample rate defaulted to 44.1 kilohertz instead of high-res 192k.', start: 4500, end: 9000, sentiment: 'NEGATIVE', confidence: 0.84 },
      { text: 'I had to go into Audio MIDI Setup in macOS to manually toggle the bitrate.', start: 9500, end: 18000, sentiment: 'NEUTRAL', confidence: 0.88 },
      { text: 'A card in the box explaining that macOS requires a manual switch would have saved me thirty minutes.', start: 18500, end: 32000, sentiment: 'NEGATIVE', confidence: 0.81 }
    ],
    entities: [
      { text: 'DAC-Mini', entity_type: 'product' },
      { text: 'Mac', entity_type: 'product' },
      { text: 'Audio MIDI Setup', entity_type: 'product' }
    ],
    mom_test: {
      task_attempted: 'Setting up DAC-Mini for lossless 192kHz audio playback on macOS',
      friction_points: [
        'Device defaulted to standard 44.1kHz bitrate without onboarding cue',
        'User spent 30 minutes troubleshooting missing lossless output'
      ],
      user_workarounds: [
        'Manually dug into macOS Audio MIDI Setup utility to configure bit depth'
      ],
      sentiment_summary: {
        positive: 1,
        neutral: 1,
        negative: 2,
        overall: 'Frustrated'
      },
      key_quotes: [
        { quote: 'The unboxing of the DAC-Mini was incredible.', timestamp: '00:01', type: 'praise' },
        { quote: 'I had to go into Audio MIDI Setup in macOS to manually toggle the bitrate.', timestamp: '00:10', type: 'workaround' },
        { quote: 'A card in the box explaining that macOS requires a manual switch would have saved me thirty minutes.', timestamp: '00:19', type: 'friction' }
      ]
    }
  }
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  // overwrite with consumer sample data
  fs.writeFileSync(DATA_FILE, JSON.stringify(CONSUMER_SAMPLES, null, 2), 'utf-8');
}

export function getAllInterviews(): InterviewRecord[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading interviews file:', err);
    return [];
  }
}

export function getInterviewById(id: string): InterviewRecord | undefined {
  const interviews = getAllInterviews();
  return interviews.find((i) => i.id === id);
}

export function saveInterview(record: InterviewRecord): void {
  ensureDataFile();
  const interviews = getAllInterviews();
  interviews.unshift(record);
  fs.writeFileSync(DATA_FILE, JSON.stringify(interviews, null, 2), 'utf-8');
}
