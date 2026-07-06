# Real Estate AI Sales Assistant Demo

A professional demo dashboard showing an AI-powered real estate sales assistant named **Sofia**, built with Next.js + Claude AI + n8n.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
# Leave blank to use the built-in smart mock (no n8n needed)
N8N_WEBHOOK_URL=
N8N_API_KEY=
```

> **No n8n?** Leave `N8N_WEBHOOK_URL` empty. The demo uses a built-in smart mock that detects intent, city, and budget from user messages and returns realistic Sofia responses.

### 3. Start the dev server
```bash
npm run dev
```

### 4. Open the demo
```
http://localhost:3000/real-estate-demo
```

---

## Connecting n8n (Optional)

When you have your n8n workflow ready:

1. Set `N8N_WEBHOOK_URL` to your webhook URL
2. Set `N8N_API_KEY` to your webhook secret (optional but recommended)
3. Restart the dev server

**Expected n8n response shape:**
```json
{
  "session_id": "sess_xxx",
  "timestamp": "ISO string",
  "reply": "Sofia's message text",
  "lead": {
    "intent": "buy | rent | sell | invest | null",
    "city": "string | null",
    "budget": 140000,
    "bedrooms": 2,
    "timeline": "string | null",
    "lead_score": 30,
    "lead_tier": "hot | warm | cold"
  },
  "properties": [],
  "system_events": [
    { "type": "intent_detected", "label": "Intent detected: BUY", "timestamp": "ISO" }
  ]
}
```

---

## Project Structure

```
app/
  real-estate-demo/page.tsx    ← Main demo page (all state lives here)
  api/chat/route.ts            ← Proxy to n8n / mock fallback
  layout.tsx                   ← Root layout
  globals.css                  ← Styles + animations

components/
  demo/
    DemoLayout.tsx             ← 3-column grid wrapper + header
    LeftPanel.tsx              ← Explanation + scenario buttons
    CenterPanel.tsx            ← Chat interface
    RightPanel.tsx             ← Lead + activity panels
  chat/
    ChatWindow.tsx             ← Scrollable message list
    ChatInput.tsx              ← Input + send button
    MessageBubble.tsx          ← User/assistant message bubbles
    TypingIndicator.tsx        ← Animated dots
    PropertyCard.tsx           ← Property result card (Milestone 2)
  lead/
    LeadPreview.tsx            ← Lead fields + score bar
  activity/
    SystemActivityFeed.tsx     ← Event log
    ActivityEvent.tsx          ← Single event row
  ui/
    StatusBadge.tsx            ← hot/warm/cold badge
    ScenarioButton.tsx         ← Clickable scenario chip
    RestartButton.tsx          ← Reset conversation

lib/
  helpers.ts                   ← Session ID, formatting, state helpers
  mockResponse.ts              ← Smart fallback mock engine

types/
  demo.ts                      ← All TypeScript types
```

---

## Demo Scenarios

Click any of these in the left panel to auto-send:

1. 🏠 **Buy** — "I'm looking to buy a 2-bedroom apartment in Bucharest. My budget is around €140k."
2. 🔑 **Rent** — "We need to rent a 3-bedroom family house in Bucharest, up to €1,600/month."
3. 📈 **Invest** — "I'm interested in an investment property in Romania around €100k."
4. 🏷️ **Sell** — "I want to sell my apartment in Floreasca. Can you help me get a valuation?"
5. 📅 **Viewing** — "I'd like to book a viewing for a property in Aviatorilor."

---

## Milestone Roadmap

| Milestone | Status | Description |
|---|---|---|
| **M1** | ✅ This build | Dashboard UI + mock chat + lead panel + activity feed |
| **M2** | 🔜 Next | Real Claude via n8n + property search from Google Sheets |
| **M3** | 🔜 Later | Hot lead Telegram notifications + lead save to Sheets |
