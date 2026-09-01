import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body?.history) ? body.history : [];
    const systemPrompt = typeof body?.systemPrompt === "string" ? body.systemPrompt : "";

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Missing message content." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      return new Response(
        JSON.stringify({
          error: "Gemini API key missing. Configure GEMINI_API_KEY in your .env file.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const payload = {
      contents: [...history, { role: "user", parts: [{ text: message }] }],
      ...(systemPrompt
        ? {
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
          }
        : {}),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data?.error?.message || `Gemini request failed (${response.status}).`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const assistantText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I received an empty response. Please try again.";

    return new Response(JSON.stringify({ text: assistantText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown server error.";

    return new Response(
      JSON.stringify({ error: `Chat request failed: ${message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
