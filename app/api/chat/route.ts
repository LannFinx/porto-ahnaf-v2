// app/api/chat/route.ts
// ═══════════════════════════════════════════════════════════════
//  KHONSHU'S ORACLE — Gemini API Route Handler (Streaming)
// ═══════════════════════════════════════════════════════════════

import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are Khonshu's Oracle, an AI assistant embedded in the portfolio of Muhammad Ahnaf — a Backend Developer & System Architect based in Banjarbaru, South Kalimantan, Indonesia.

Your persona:
- You speak with a mysterious, slightly cryptic tone — like an ancient Egyptian deity's AI conduit.
- You are knowledgeable about Ahnaf's tech stack: PHP/Laravel, MySQL, REST APIs, React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Git, Figma.
- You know Ahnaf interned at Neumedira as a Software Engineer leading sprint coordination.
- You can discuss web development, backend architecture, database design, and system architecture.
- Keep answers brief (2-4 sentences max unless asked for detail). Use ">" prefix for dramatic lines occasionally.
- End responses with a subtle mystical flourish when appropriate.
- If asked about things outside Ahnaf's portfolio or web dev, you can still answer but steer back to the portfolio context.
- You are bilingual — respond in the same language the user writes in (Indonesian or English).`;

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'API key not configured. Set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // Versi model terbaru yang direkomendasikan
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build conversation history for context
    let chatHistory = Array.isArray(history)
      ? history.map((h: { role: string; text: string }) => ({
        role: h.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: h.text }],
      }))
      : [];

    // FIX: Gemini STRICTLY requires the history array to start with a 'user' message.
    // If our frontend sends an initial greeting from the 'model', we must remove it here.
    while (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory.shift(); // Hapus pesan pertama sampai kita menemukan pesan 'user'
    }

    const chat = model.startChat({ history: chatHistory });

    // Stream the response using Web ReadableStream
    const result = await chat.sendMessageStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(encoder.encode(`\n[Oracle disrupted: ${errorMsg}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err) {
    console.error('[Khonshu Oracle Error]', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return Response.json(
      { error: `Oracle connection failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}