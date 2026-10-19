# EchoInterview 🎙️
### Autonomous Qualitative Voice Researcher powered by AssemblyAI

> Built for the **AssemblyAI Voice Hackathon Week 2026**

**EchoInterview** is an embeddable, autonomous voice agent that conducts 90-second qualitative product interviews with real users right after they interact with your product. 

Instead of sending boring Google Forms that have a 1% response rate or trying to schedule 30 Zoom calls a week, EchoInterview embeds a lightweight voice widget directly into your web app. It captures user speech, processes it through AssemblyAI's Speech Intelligence engine, and delivers structured qualitative insights, friction alerts, and unprompted user workarounds to a founder dashboard.

---

## 🌟 Why EchoInterview? (The Mom Test Approach)

Most AI interview tools fail because:
1. **They ask hypothetical questions:** *"Would you pay for this feature?"* Users lie to be polite.
2. **They parrot users mechanically:** Repeating back whatever the user said in a robotic tone.
3. **They smooth out outliers:** Standard LLM summaries reduce golden edge-case workarounds into bland platitudes like *"Users want a more intuitive UI"*.

EchoInterview strictly applies Rob Fitzpatrick's **The Mom Test** principles:
- **Focuses on past behavior:** Asks what the user *actually tried to do* and where expectations diverged.
- **Isolates the Workaround:** Discovers the specific hack or detour the user resorted to when the app failed (e.g. *"I opened Finder to verify the volume mount"*).
- **Grounded Friction Alerts:** Flags negative sentiment utterances with millisecond timestamps.

---

## 🚀 Key Features

* **Embeddable Voice Widget (`<EchoWidget />`):** A floating, discreet widget that can be dropped into any React or web application with 1 line of code.
* **Real-time Web Audio Visualizer:** Dynamic Canvas audio waveform responding to microphone input.
* **AssemblyAI Speech Intelligence:**
  * **Speech-to-Text & Diarization:** Multi-speaker transcription with timestamped utterances.
  * **Informative Summarization:** Automated bulleted executive takeaways.
  * **Sentence-Level Sentiment Analysis:** Auto-detects friction moments when frustration peaks.
  * **Entity Detection:** Indexes mentioned products, tools, and roles.
* **Founder Intelligence Dashboard (`/dashboard`):**
  * Linear-inspired dark mode interface.
  * Friction alerts, unprompted workarounds, and direct audio quotes.
  * Searchable session history.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling:** Tailwind CSS, Lucide Icons
- **Audio Capture:** Web Audio API, MediaRecorder (`audio/webm`)
- **Speech AI:** [AssemblyAI Node.js SDK](https://www.assemblyai.com)
  - `summarization` (Informative Bullets)
  - `sentiment_analysis`
  - `entity_detection`
  - `speaker_labels`
- **Data Persistence:** Local JSON Database (zero-config, portable)

---

## 💻 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/abhishek1846/echo-interview.git
cd echo-interview
npm install
```

### 2. Configure AssemblyAI API Key

Create a `.env.local` file in the project root:

```env
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Visit `/` to see the demo host app (Gatsby e-reader) and test the interactive voice widget.
- Visit `/dashboard` to inspect analyzed interviews, friction points, and speech intelligence reports.

---

## 📄 License

MIT License. Built with ❤️ for the AssemblyAI Voice Hackathon 2026.
