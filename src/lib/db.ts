import fs from 'fs';
import path from 'path';
import { InterviewRecord } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'interviews.json');

const INITIAL_SAMPLES: InterviewRecord[] = [
  {
    id: 'intv_gatsby_01',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    duration_seconds: 78,
    product_name: 'Gatsby Desktop',
    transcript_text: 'I just imported about 40 EPUB books into Gatsby. The layout is super clean and I really liked that it automatically extracted the book covers. But when I plugged in my Kindle Paperwhite over USB, it took almost 15 seconds to detect it. I thought the app was frozen. I ended up opening Finder to check if the volume was mounted, and only after I refreshed the device status did it show up. Once it showed up, sending books was fast, but that initial lag was scary.',
    summary: '- User imported 40 EPUB books and praised the clean layout and automatic cover extraction.\n- Encountered a 15-second delay detecting a USB-connected Kindle Paperwhite, causing them to believe the app was frozen.\n- User checked Finder as a workaround before manually refreshing the status.',
    utterances: [
      {
        speaker: 'A',
        start: 0,
        end: 8500,
        text: 'I just imported about 40 EPUB books into Gatsby. The layout is super clean and I really liked that it automatically extracted the book covers.'
      },
      {
        speaker: 'A',
        start: 9000,
        end: 22000,
        text: 'But when I plugged in my Kindle Paperwhite over USB, it took almost 15 seconds to detect it. I thought the app was frozen.'
      },
      {
        speaker: 'A',
        start: 22500,
        end: 32000,
        text: 'I ended up opening Finder to check if the volume was mounted, and only after I refreshed the device status did it show up.'
      },
      {
        speaker: 'A',
        start: 32500,
        end: 41000,
        text: 'Once it showed up, sending books was fast, but that initial lag was scary.'
      }
    ],
    sentiment_results: [
      { text: 'The layout is super clean and I really liked that it automatically extracted the book covers.', start: 0, end: 8500, sentiment: 'POSITIVE', confidence: 0.94 },
      { text: 'But when I plugged in my Kindle Paperwhite over USB, it took almost 15 seconds to detect it.', start: 9000, end: 16000, sentiment: 'NEGATIVE', confidence: 0.88 },
      { text: 'I thought the app was frozen.', start: 16500, end: 22000, sentiment: 'NEGATIVE', confidence: 0.92 },
      { text: 'I ended up opening Finder to check if the volume was mounted, and only after I refreshed the device status did it show up.', start: 22500, end: 32000, sentiment: 'NEUTRAL', confidence: 0.85 },
      { text: 'Once it showed up, sending books was fast, but that initial lag was scary.', start: 32500, end: 41000, sentiment: 'NEGATIVE', confidence: 0.79 }
    ],
    entities: [
      { text: 'Gatsby', entity_type: 'organization' },
      { text: 'EPUB', entity_type: 'product' },
      { text: 'Kindle Paperwhite', entity_type: 'product' },
      { text: 'USB', entity_type: 'product' },
      { text: 'Finder', entity_type: 'product' }
    ],
    mom_test: {
      task_attempted: 'Syncing sideloaded EPUB books to Kindle Paperwhite via USB',
      friction_points: [
        '15-second latency before connected Kindle appeared in UI',
        'Lack of active polling indicator led user to believe app froze'
      ],
      user_workarounds: [
        'Opened macOS Finder to manually verify volume mount',
        'Clicked manual refresh button repeatedly'
      ],
      sentiment_summary: {
        positive: 1,
        neutral: 1,
        negative: 3,
        overall: 'Frustrated'
      },
      key_quotes: [
        { quote: 'I thought the app was frozen.', timestamp: '00:16', type: 'friction' },
        { quote: 'I ended up opening Finder to check if the volume was mounted.', timestamp: '00:22', type: 'workaround' },
        { quote: 'The layout is super clean and I really liked that it automatically extracted the book covers.', timestamp: '00:02', type: 'praise' }
      ]
    }
  },
  {
    id: 'intv_gatsby_02',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    duration_seconds: 64,
    product_name: 'Gatsby Desktop',
    transcript_text: 'I was trying to sort my books by date added, but clicking the header did not sort properly until I restarted the app. Also on the table rows, only the title text was clickable. I kept clicking the empty white space on the row to open the details pane and nothing happened. I had to aim my mouse precisely at the title.',
    summary: '- User experienced issues sorting books by date added, requiring an app restart to function.\n- Reported difficulty clicking table rows, where only the text registered clicks rather than the full row space.',
    utterances: [
      {
        speaker: 'A',
        start: 0,
        end: 12000,
        text: 'I was trying to sort my books by date added, but clicking the header did not sort properly until I restarted the app.'
      },
      {
        speaker: 'A',
        start: 12500,
        end: 25000,
        text: 'Also on the table rows, only the title text was clickable. I kept clicking the empty white space on the row to open the details pane and nothing happened.'
      },
      {
        speaker: 'A',
        start: 25500,
        end: 33000,
        text: 'I had to aim my mouse precisely at the title.'
      }
    ],
    sentiment_results: [
      { text: 'I was trying to sort my books by date added, but clicking the header did not sort properly until I restarted the app.', start: 0, end: 12000, sentiment: 'NEGATIVE', confidence: 0.86 },
      { text: 'I kept clicking the empty white space on the row to open the details pane and nothing happened.', start: 12500, end: 25000, sentiment: 'NEGATIVE', confidence: 0.91 },
      { text: 'I had to aim my mouse precisely at the title.', start: 25500, end: 33000, sentiment: 'NEGATIVE', confidence: 0.82 }
    ],
    entities: [
      { text: 'books', entity_type: 'product' },
      { text: 'table rows', entity_type: 'concept' }
    ],
    mom_test: {
      task_attempted: 'Sorting library by date and clicking rows to inspect book metadata',
      friction_points: [
        'Date added sorting did not immediately re-render table',
        'WebKit row hit-target collapsed to text-only geometry'
      ],
      user_workarounds: [
        'Restarted the app to refresh sorted state',
        'Carefully aimed cursor directly on font glyphs'
      ],
      sentiment_summary: {
        positive: 0,
        neutral: 0,
        negative: 3,
        overall: 'Frustrated'
      },
      key_quotes: [
        { quote: 'I kept clicking the empty white space on the row and nothing happened.', timestamp: '00:15', type: 'friction' },
        { quote: 'I had to aim my mouse precisely at the title.', timestamp: '00:26', type: 'friction' }
      ]
    }
  }
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SAMPLES, null, 2), 'utf-8');
  }
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
  // prepend newly recorded interview
  interviews.unshift(record);
  fs.writeFileSync(DATA_FILE, JSON.stringify(interviews, null, 2), 'utf-8');
}
