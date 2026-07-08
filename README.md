# Real Estate AI Sales Assistant Demo

A reusable sales-demo template for real estate companies. One Next.js frontend, one n8n workflow, and one agent logic can be reused across multiple companies with a `client_id`.

## Quick Start

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/real-estate-demo
http://localhost:3000/real-estate-demo?client=company_a
http://localhost:3000/real-estate-demo?client=company_b
http://localhost:3000/real-estate-demo?client=godubai
```

Set `.env.local` when connecting to n8n:

```env
N8N_WEBHOOK_URL=
N8N_API_KEY=
```

If `N8N_WEBHOOK_URL` is empty or unreachable, the app uses the built-in mock response engine.

## Client Config Structure

Client setup lives in `lib/demoClients.ts`.

Each client has:

```ts
{
  clientId: "company_a",
  companyName: "Company A Real Estate",
  assistantName: "Sofia",
  websiteUrl: "https://example.com/company-a",
  logoUrl: undefined,
  initials: "CA",
  market: "Romania",
  serviceAreas: ["Bucharest"],
  companyStrengths: [
    "local real estate expertise",
    "fast viewing coordination",
    "support for buyers, renters, sellers, and investors"
  ],
  propertyTypes: ["apartments", "houses", "investment properties"],
  welcomeMessage: "...",
  demoPromptGroups: [...],
  n8nClientId: "company_a"
}
```

The selected config updates the company name, assistant label, welcome message, left-panel demo prompts, branding initials/logo, and every `/api/chat` payload.

Every chat request sends:

```json
{
  "client_id": "company_a",
  "session_id": "sess_xxx",
  "user_message": "...",
  "message_history": [],
  "current_lead": {},
  "current_lead_capture": {},
  "last_properties": []
}
```

## Add A Third Company

1. Add a new object to `demoClients` in `lib/demoClients.ts`, for example `company_c`.
2. Set `clientId` and `n8nClientId` to `company_c`.
3. Add company-specific `companyName`, `websiteUrl`, `initials` or `logoUrl`, `market`, `serviceAreas`, `companyStrengths`, `propertyTypes`, `welcomeMessage`, and `demoPromptGroups`.
4. Create Google Sheet tabs named `company_c_properties` and `company_c_leads`.
5. Add sample or real listings to `company_c_properties`.
6. Add `company_c` to the n8n Resolve Client Config node.
7. Test `http://localhost:3000/real-estate-demo?client=company_c`.

## Website-Based Company Setup

This is intentionally manual for now. Do not scrape inside the app.

1. Visit the company website.
2. Extract company name, market, service areas, property types, tone, strengths, and contact info.
3. Add those values to `lib/demoClients.ts`.
4. Create Google Sheet tabs:
   - `company_a_properties`
   - `company_a_leads`
   - `company_b_properties`
   - `company_b_leads`
5. Add sample or real listings to the property tabs.
6. Open `/real-estate-demo?client=company_a` or `/real-estate-demo?client=company_b`.

## Required Google Sheet Tabs

Default client:

- `properties`
- `leads`

Company A:

- `company_a_properties`
- `company_a_leads`

Company B:

- `company_b_properties`
- `company_b_leads`

GoDubai:

- `godubai_properties`
- `godubai_leads`

Each properties tab should use the same columns as the original `properties` tab. Each leads tab should use the same columns as the original `leads` tab.

## n8n Changes

The updated workflow export is `n8n_workflow_milestone3.json`.

Changed nodes:

- `Extract Variables`: now reads `client_id` from the webhook body.
- `Resolve Client Config`: new Code node that maps `default`, `company_a`, and `company_b` to sheet names and company context.
- `Build Extraction Prompt`: passes `clientId` and `clientConfig` forward.
- `Parse Extraction`: passes `clientId` and `clientConfig` forward.
- `Google Sheets Get Properties`: uses `clientConfig.propertiesSheet`.
- `Filter Properties`: passes `clientId` and `clientConfig` forward.
- `Build Messages With Properties`: injects COMPANY CONTEXT and sales-assistant rules into Agent 2.
- `Build Messages No Search`: injects COMPANY CONTEXT and sales-assistant rules into Agent 2.
- `Google Sheets Append Lead`: uses `clientConfig.leadsSheet`.
- `Telegram Notification`: includes the company name and client id, and can use `clientConfig.telegramChatId`.
- `Assemble Final JSON`: uses company-aware event labels.

OpenAI model setup:

- `OpenAI Extract Criteria`: calls the OpenAI Responses API with `gpt-5.4-mini` for fast structured extraction.
- `OpenAI Generate Reply`: calls the OpenAI Responses API with `gpt-5.5` for high-quality sales replies.
- Both OpenAI nodes use the n8n credential named `OpenAI account`.
- The workflow keeps Google Sheets search, lead saving, and Telegram as deterministic nodes instead of putting all behavior inside one AI Agent node. This is more reliable for property cards and lead capture because the model writes the conversation while n8n controls data operations.

If your n8n Google Sheets node does not accept dynamic sheet names, replace the dynamic sheet expression with a Switch node on `clientId`, then route to separate Google Sheets nodes for `default`, `company_a`, and `company_b`.

## Agent 2 Sales Behavior

Agent 2 now acts as:

```text
You are {{assistantName}}, the AI real estate sales assistant for {{companyName}}.
```

It receives:

```text
COMPANY CONTEXT:
Company Name
Market
Website
Service Areas
Company Strengths
```

It is instructed to qualify naturally, recommend the strongest factual match, explain why it fits, guide serious visitors toward viewings or team follow-up, and capture contact details when intent is serious.

It must not invent property details, company claims, market data, urgency, or advice. If asked whether it is AI, it says it is an AI property assistant for the selected company.

## Project Structure

```text
app/real-estate-demo/page.tsx    Main client-aware demo page
app/api/chat/route.ts            Proxy to n8n / mock fallback
components/demo/LeftPanel.tsx    Client-aware branding and prompts
components/demo/CenterPanel.tsx  Client-aware assistant header
components/demo/DemoLayout.tsx   Client-aware top bar
lib/demoClients.ts               Client config registry
lib/mockResponse.ts              Client-aware mock response engine
types/demo.ts                    Shared TypeScript types
n8n_workflow_milestone3.json     Client-aware n8n workflow export
```
