import fs from 'fs';
import path from 'path';
import { InterviewRecord } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'interviews.json');

export const CONSUMER_SAMPLES: InterviewRecord[] = [
  {
    id: 'intv_kroma_01',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    duration_seconds: 58,
    product_name: 'Kroma Audio - Model-1',
    transcript_text: 'Echo: Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?\nCustomer: I was trying to checkout with the Model-1 headphones and the lambskin ear cushion pack to Toronto.\nEcho: Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?\nCustomer: At the shipping calculator. It showed courier shipping for $35, but did not say whether Canadian import duties and GST were included. For a $600 order, surprise customs can add $80 at delivery.\nEcho: When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?\nCustomer: I pulled up Reddit on my phone to see if anyone in Canada had ordered direct from Kroma. I could not find a clear post, so I left the tab open and did not finish ordering.\nEcho: That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!',
    summary: '- Shopper attempted to purchase Model-1 headphones and ear cushions shipped to Toronto.\n- Abandoned cart because shipping options did not clarify whether customs and GST were prepaid or collected upon arrival.\n- Looked on Reddit for Canadian delivery experiences before leaving the checkout flow.',
    utterances: [
      {
        speaker: 'Echo (AI)',
        start: 0,
        end: 5500,
        text: 'Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?'
      },
      {
        speaker: 'Customer',
        start: 7000,
        end: 12800,
        text: 'I was trying to checkout with the Model-1 headphones and the lambskin ear cushion pack to Toronto.'
      },
      {
        speaker: 'Echo (AI)',
        start: 14000,
        end: 19500,
        text: 'Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?'
      },
      {
        speaker: 'Customer',
        start: 21000,
        end: 32400,
        text: 'At the shipping calculator. It showed courier shipping for $35, but did not say whether Canadian import duties and GST were included. For a $600 order, surprise customs can add $80 at delivery.'
      },
      {
        speaker: 'Echo (AI)',
        start: 34000,
        end: 39000,
        text: 'When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?'
      },
      {
        speaker: 'Customer',
        start: 41000,
        end: 51500,
        text: 'I pulled up Reddit on my phone to see if anyone in Canada had ordered direct from Kroma. I could not find a clear post, so I left the tab open and did not finish ordering.'
      },
      {
        speaker: 'Echo (AI)',
        start: 53000,
        end: 58000,
        text: 'That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!'
      }
    ],
    sentiment_results: [
      { text: 'I was trying to checkout with the Model-1 headphones and the lambskin ear cushion pack to Toronto.', start: 7000, end: 12800, sentiment: 'NEUTRAL', confidence: 0.94, speaker: 'Customer' },
      { text: 'It showed courier shipping for $35, but did not say whether Canadian import duties and GST were included.', start: 21000, end: 27000, sentiment: 'NEGATIVE', confidence: 0.92, speaker: 'Customer' },
      { text: 'For a $600 order, surprise customs can add $80 at delivery.', start: 27500, end: 32400, sentiment: 'NEGATIVE', confidence: 0.88, speaker: 'Customer' },
      { text: 'I pulled up Reddit on my phone to see if anyone in Canada had ordered direct from Kroma.', start: 41000, end: 46000, sentiment: 'NEUTRAL', confidence: 0.85, speaker: 'Customer' },
      { text: 'I could not find a clear post, so I left the tab open and did not finish ordering.', start: 46500, end: 51500, sentiment: 'NEGATIVE', confidence: 0.95, speaker: 'Customer' }
    ],
    entities: [
      { text: 'Model-1', entity_type: 'product' },
      { text: 'Toronto', entity_type: 'location' },
      { text: 'Canada', entity_type: 'location' },
      { text: 'Reddit', entity_type: 'platform' },
      { text: 'Kroma Audio', entity_type: 'organization' }
    ],
    mom_test: {
      task_attempted: 'Completing checkout for Model-1 headphones and ear cushions to Toronto',
      friction_points: [
        'Shipping calculator failed to state if customs duties and Canadian GST were included in price',
        'Fear of surprise $80 customs fee at the door caused immediate checkout abandonment'
      ],
      user_workarounds: [
        'Searched Reddit on mobile for international delivery experiences with Kroma',
        'Left cart open and postponed order indefinitely'
      ],
      sentiment_summary: {
        positive: 0,
        neutral: 2,
        negative: 3,
        overall: 'Frustrated'
      },
      key_quotes: [
        { quote: 'It showed courier shipping for $35, but did not say whether Canadian import duties and GST were included.', timestamp: '00:21', type: 'friction' },
        { quote: 'I pulled up Reddit on my phone to see if anyone in Canada had ordered direct from Kroma.', timestamp: '00:41', type: 'workaround' },
        { quote: 'I left the tab open and did not finish ordering.', timestamp: '00:47', type: 'friction' }
      ]
    },
    turns: [
      {
        id: 'turn_k1_1',
        role: 'agent',
        text: 'Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?',
        timestamp: '00:00'
      },
      {
        id: 'turn_k1_2',
        role: 'user',
        text: 'I was trying to checkout with the Model-1 headphones and the lambskin ear cushion pack to Toronto.',
        timestamp: '00:07'
      },
      {
        id: 'turn_k1_3',
        role: 'agent',
        text: 'Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?',
        timestamp: '00:14'
      },
      {
        id: 'turn_k1_4',
        role: 'user',
        text: 'At the shipping calculator. It showed courier shipping for $35, but did not say whether Canadian import duties and GST were included. For a $600 order, surprise customs can add $80 at delivery.',
        timestamp: '00:21'
      },
      {
        id: 'turn_k1_5',
        role: 'agent',
        text: 'When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?',
        timestamp: '00:34'
      },
      {
        id: 'turn_k1_6',
        role: 'user',
        text: 'I pulled up Reddit on my phone to see if anyone in Canada had ordered direct from Kroma. I could not find a clear post, so I left the tab open and did not finish ordering.',
        timestamp: '00:41'
      },
      {
        id: 'turn_k1_7',
        role: 'agent',
        text: 'That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!',
        timestamp: '00:53'
      }
    ]
  },
  {
    id: 'intv_kroma_02',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    duration_seconds: 56,
    product_name: 'Kroma Audio - DAC-Mini',
    transcript_text: 'Echo: Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?\nCustomer: I received the DAC-Mini desktop amp yesterday and was plugging it into my MacBook Pro for Apple Music Lossless.\nEcho: Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?\nCustomer: The front sample rate indicator stayed lit on 44.1 kHz even while streaming 192 kHz high-res tracks. The quick-start booklet only said plug-and-play, so I assumed the unit was defective.\nEcho: When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?\nCustomer: I searched Head-Fi forums on my phone. Another user explained that macOS CoreAudio locks USB DACs at 44.1 kHz until you manually open Audio MIDI Setup and pick 24-bit 192 kHz.\nEcho: That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!',
    summary: '- User set up the DAC-Mini desktop amplifier on macOS for high-res streaming.\n- Experienced friction when DAC LED remained locked at 44.1kHz instead of 192kHz.\n- Discovered via Head-Fi forum posts that macOS requires manual sample rate switching inside Audio MIDI Setup utility.',
    utterances: [
      {
        speaker: 'Echo (AI)',
        start: 0,
        end: 5500,
        text: 'Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?'
      },
      {
        speaker: 'Customer',
        start: 7000,
        end: 13000,
        text: 'I received the DAC-Mini desktop amp yesterday and was plugging it into my MacBook Pro for Apple Music Lossless.'
      },
      {
        speaker: 'Echo (AI)',
        start: 14500,
        end: 20000,
        text: 'Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?'
      },
      {
        speaker: 'Customer',
        start: 21500,
        end: 32500,
        text: 'The front sample rate indicator stayed lit on 44.1 kHz even while streaming 192 kHz high-res tracks. The quick-start booklet only said plug-and-play, so I assumed the unit was defective.'
      },
      {
        speaker: 'Echo (AI)',
        start: 34000,
        end: 39200,
        text: 'When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?'
      },
      {
        speaker: 'Customer',
        start: 41000,
        end: 52000,
        text: 'I searched Head-Fi forums on my phone. Another user explained that macOS CoreAudio locks USB DACs at 44.1 kHz until you manually open Audio MIDI Setup and pick 24-bit 192 kHz.'
      },
      {
        speaker: 'Echo (AI)',
        start: 53500,
        end: 58500,
        text: 'That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!'
      }
    ],
    sentiment_results: [
      { text: 'I received the DAC-Mini desktop amp yesterday and was plugging it into my MacBook Pro for Apple Music Lossless.', start: 7000, end: 13000, sentiment: 'POSITIVE', confidence: 0.93, speaker: 'Customer' },
      { text: 'The front sample rate indicator stayed lit on 44.1 kHz even while streaming 192 kHz high-res tracks.', start: 21500, end: 27000, sentiment: 'NEGATIVE', confidence: 0.88, speaker: 'Customer' },
      { text: 'The quick-start booklet only said plug-and-play, so I assumed the unit was defective.', start: 27500, end: 32500, sentiment: 'NEGATIVE', confidence: 0.91, speaker: 'Customer' },
      { text: 'I searched Head-Fi forums on my phone.', start: 41000, end: 44000, sentiment: 'NEUTRAL', confidence: 0.86, speaker: 'Customer' },
      { text: 'Another user explained that macOS CoreAudio locks USB DACs at 44.1 kHz until you manually open Audio MIDI Setup.', start: 44500, end: 52000, sentiment: 'NEUTRAL', confidence: 0.89, speaker: 'Customer' }
    ],
    entities: [
      { text: 'DAC-Mini', entity_type: 'product' },
      { text: 'MacBook Pro', entity_type: 'hardware' },
      { text: 'Apple Music', entity_type: 'service' },
      { text: 'Audio MIDI Setup', entity_type: 'software' },
      { text: 'Head-Fi', entity_type: 'community' }
    ],
    mom_test: {
      task_attempted: 'Configuring DAC-Mini for 192kHz lossless output on macOS',
      friction_points: [
        'Hardware LED stayed at 44.1kHz with no clear cue on why bitrate was downsampled',
        'Quick-start guide omitted necessary macOS CoreAudio configuration instructions'
      ],
      user_workarounds: [
        'Researched setup workarounds on Head-Fi forum threads',
        'Manually opened Audio MIDI Setup in macOS to set format to 24-bit 192kHz'
      ],
      sentiment_summary: {
        positive: 1,
        neutral: 2,
        negative: 2,
        overall: 'Neutral'
      },
      key_quotes: [
        { quote: 'The quick-start booklet only said plug-and-play, so I assumed the unit was defective.', timestamp: '00:27', type: 'friction' },
        { quote: 'I searched Head-Fi forums on my phone.', timestamp: '00:41', type: 'workaround' },
        { quote: 'You manually open Audio MIDI Setup and pick 24-bit 192 kHz.', timestamp: '00:47', type: 'workaround' }
      ]
    },
    turns: [
      {
        id: 'turn_k2_1',
        role: 'agent',
        text: 'Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?',
        timestamp: '00:00'
      },
      {
        id: 'turn_k2_2',
        role: 'user',
        text: 'I received the DAC-Mini desktop amp yesterday and was plugging it into my MacBook Pro for Apple Music Lossless.',
        timestamp: '00:07'
      },
      {
        id: 'turn_k2_3',
        role: 'agent',
        text: 'Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?',
        timestamp: '00:14'
      },
      {
        id: 'turn_k2_4',
        role: 'user',
        text: 'The front sample rate indicator stayed lit on 44.1 kHz even while streaming 192 kHz high-res tracks. The quick-start booklet only said plug-and-play, so I assumed the unit was defective.',
        timestamp: '00:21'
      },
      {
        id: 'turn_k2_5',
        role: 'agent',
        text: 'When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?',
        timestamp: '00:34'
      },
      {
        id: 'turn_k2_6',
        role: 'user',
        text: 'I searched Head-Fi forums on my phone. Another user explained that macOS CoreAudio locks USB DACs at 44.1 kHz until you manually open Audio MIDI Setup and pick 24-bit 192 kHz.',
        timestamp: '00:41'
      },
      {
        id: 'turn_k2_7',
        role: 'agent',
        text: 'That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!',
        timestamp: '00:53'
      }
    ]
  },
  {
    id: 'intv_kroma_03',
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    duration_seconds: 54,
    product_name: 'Kroma Audio - Modular Cables',
    transcript_text: 'Echo: Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?\nCustomer: I was browsing your accessories collection trying to find a balanced 4.4mm cable with a built-in boom microphone for Zoom calls.\nEcho: Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?\nCustomer: The product specifications listed 4.4mm Pentaconn balanced pinouts, but gave zero information on whether voice mic pass-through works over balanced connections or if I need the standard 3.5mm cable.\nEcho: When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?\nCustomer: I reached out to live chat support, but nobody replied within ten minutes. I did not want to wait around, so I ordered a separate Antlion ModMic from Amazon instead.\nEcho: That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!',
    summary: '- Shopper needed a balanced 4.4mm headphone cable compatible with voice microphone input.\n- Product catalog failed to document whether balanced Pentaconn supports mic audio pass-through.\n- Unresponsive live chat caused shopper to purchase third-party microphone on Amazon.',
    utterances: [
      {
        speaker: 'Echo (AI)',
        start: 0,
        end: 5500,
        text: 'Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?'
      },
      {
        speaker: 'Customer',
        start: 7000,
        end: 13500,
        text: 'I was browsing your accessories collection trying to find a balanced 4.4mm cable with a built-in boom microphone for Zoom calls.'
      },
      {
        speaker: 'Echo (AI)',
        start: 15000,
        end: 20500,
        text: 'Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?'
      },
      {
        speaker: 'Customer',
        start: 22000,
        end: 34000,
        text: 'The product specifications listed 4.4mm Pentaconn balanced pinouts, but gave zero information on whether voice mic pass-through works over balanced connections or if I need the standard 3.5mm cable.'
      },
      {
        speaker: 'Echo (AI)',
        start: 35500,
        end: 40500,
        text: 'When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?'
      },
      {
        speaker: 'Customer',
        start: 42000,
        end: 51500,
        text: 'I reached out to live chat support, but nobody replied within ten minutes. I did not want to wait around, so I ordered a separate Antlion ModMic from Amazon instead.'
      },
      {
        speaker: 'Echo (AI)',
        start: 53000,
        end: 58000,
        text: 'That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!'
      }
    ],
    sentiment_results: [
      { text: 'I was browsing your accessories collection trying to find a balanced 4.4mm cable with a built-in boom microphone.', start: 7000, end: 13500, sentiment: 'NEUTRAL', confidence: 0.91, speaker: 'Customer' },
      { text: 'Gave zero information on whether voice mic pass-through works over balanced connections.', start: 22000, end: 28000, sentiment: 'NEGATIVE', confidence: 0.94, speaker: 'Customer' },
      { text: 'I reached out to live chat support, but nobody replied within ten minutes.', start: 42000, end: 47000, sentiment: 'NEGATIVE', confidence: 0.89, speaker: 'Customer' },
      { text: 'I did not want to wait around, so I ordered a separate Antlion ModMic from Amazon instead.', start: 47500, end: 51500, sentiment: 'NEGATIVE', confidence: 0.92, speaker: 'Customer' }
    ],
    entities: [
      { text: '4.4mm balanced cable', entity_type: 'accessory' },
      { text: 'Pentaconn', entity_type: 'standard' },
      { text: 'Amazon', entity_type: 'competitor' },
      { text: 'Antlion ModMic', entity_type: 'product' },
      { text: 'Zoom', entity_type: 'platform' }
    ],
    mom_test: {
      task_attempted: 'Selecting a modular cable with voice mic support for Model-1 headphones',
      friction_points: [
        'Accessory specification lacked microphone wiring pinout documentation',
        'Store live chat had high latency with zero replies in 10 minutes'
      ],
      user_workarounds: [
        'Attempted live chat query before giving up',
        'Purchased third-party ModMic on Amazon instead of official brand cable'
      ],
      sentiment_summary: {
        positive: 0,
        neutral: 1,
        negative: 3,
        overall: 'Frustrated'
      },
      key_quotes: [
        { quote: 'Gave zero information on whether voice mic pass-through works over balanced connections.', timestamp: '00:26', type: 'friction' },
        { quote: 'Nobody replied within ten minutes.', timestamp: '00:44', type: 'friction' },
        { quote: 'I ordered a separate Antlion ModMic from Amazon instead.', timestamp: '00:48', type: 'workaround' }
      ]
    },
    turns: [
      {
        id: 'turn_k3_1',
        role: 'agent',
        text: 'Hi! Thanks for taking 90 seconds to chat with Kroma Audio. What was the main gear or product you were looking to buy or configure today?',
        timestamp: '00:00'
      },
      {
        id: 'turn_k3_2',
        role: 'user',
        text: 'I was browsing your accessories collection trying to find a balanced 4.4mm cable with a built-in boom microphone for Zoom calls.',
        timestamp: '00:07'
      },
      {
        id: 'turn_k3_3',
        role: 'agent',
        text: 'Understood. When you were going through that flow, at what exact point did things feel unclear, slow, or make you hesitate?',
        timestamp: '00:15'
      },
      {
        id: 'turn_k3_4',
        role: 'user',
        text: 'The product specifications listed 4.4mm Pentaconn balanced pinouts, but gave zero information on whether voice mic pass-through works over balanced connections or if I need the standard 3.5mm cable.',
        timestamp: '00:22'
      },
      {
        id: 'turn_k3_5',
        role: 'agent',
        text: 'When you ran into that snag, what did you do next? Did you find a workaround or decide to hold off?',
        timestamp: '00:35'
      },
      {
        id: 'turn_k3_6',
        role: 'user',
        text: 'I reached out to live chat support, but nobody replied within ten minutes. I did not want to wait around, so I ordered a separate Antlion ModMic from Amazon instead.',
        timestamp: '00:42'
      },
      {
        id: 'turn_k3_7',
        role: 'agent',
        text: 'That gives our product team the exact context we needed to fix this. Thank you so much for your time and feedback!',
        timestamp: '00:53'
      }
    ]
  }
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(CONSUMER_SAMPLES, null, 2), 'utf-8');
  }
}

export function getAllInterviews(): InterviewRecord[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(CONSUMER_SAMPLES, null, 2), 'utf-8');
      return CONSUMER_SAMPLES;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading interviews file:', err);
    return CONSUMER_SAMPLES;
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
