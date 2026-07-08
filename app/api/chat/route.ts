import { NextRequest, NextResponse } from 'next/server';
import { ChatResponse, Lead, EMPTY_LEAD, EMPTY_LEAD_CAPTURE } from '@/types/demo';
import { buildMockResponse } from '@/lib/mockResponse';
import { getDemoClient } from '@/lib/demoClients';

// ─────────────────────────────────────────────────────────────
// app/api/chat/route.ts
// Server-side proxy between the dashboard and n8n webhook.
// Falls back to smart mock responses if n8n is not configured.
// ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      client_id,
      session_id,
      user_message,
      message_history,
      current_lead,
      current_lead_capture,
      last_properties,
    } = body;
    const clientConfig = getDemoClient(client_id);

    if (!user_message || typeof user_message !== 'string') {
      return NextResponse.json(
        { error: 'user_message is required' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const apiKey = process.env.N8N_API_KEY;

    // ── Use n8n if configured ──────────────────────────────
    if (webhookUrl) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const n8nRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'X-Demo-Key': apiKey } : {}),
          },
          body: JSON.stringify({
            client_id: clientConfig.n8nClientId,
            session_id,
            user_message,
            message_history,
            current_lead,
            current_lead_capture,
            last_properties,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!n8nRes.ok) {
          throw new Error(`n8n returned status ${n8nRes.status}`);
        }

        const data: ChatResponse = await n8nRes.json();
        return NextResponse.json(data);
      } catch (n8nError) {
        // Log the error but fall through to mock
        console.error('[chat/route] n8n error, using mock fallback:', n8nError);
      }
    }

    // ── Mock fallback ─────────────────────────────────────
    // Runs when n8n is not configured or unreachable.
    // Simulates realistic Sofia responses with lead detection.
    const leadContext: Lead = current_lead ?? EMPTY_LEAD;
    const leadCaptureContext = current_lead_capture ?? EMPTY_LEAD_CAPTURE;

    // Slight artificial delay to simulate real API latency
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const mockData = buildMockResponse(
      session_id,
      user_message,
      leadContext,
      leadCaptureContext,
      clientConfig
    );
    return NextResponse.json(mockData);

  } catch (error) {
    console.error('[chat/route] Unhandled error:', error);

    // Always return the correct shape, even on failure
    const errorResponse: ChatResponse = {
      session_id: 'error',
      timestamp: new Date().toISOString(),
      reply:
        "I'm having a brief technical issue. Please try again in a moment — apologies for the inconvenience! 🙏",
      lead: EMPTY_LEAD,
      lead_capture: EMPTY_LEAD_CAPTURE,
      properties: [],
      system_events: [
        {
          type: 'error',
          label: 'Connection error — using fallback',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    return NextResponse.json(errorResponse, { status: 200 });
  }
}
