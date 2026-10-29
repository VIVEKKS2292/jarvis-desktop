const { GoogleGenAI } = require("@google/genai");

const SYSTEM_PROMPT =
  "You are a concise, helpful desktop assistant. Keep answers short unless asked for detail.";

/**
 * Every provider is an async generator:
 *   ({ apiKey, model, messages, signal }) => AsyncIterable<string>
 * messages: [{ role: "user" | "assistant", content: string }]
 * Add Anthropic / OpenAI-compatible / Ollama by adding one more entry here.
 */
const providers = {
  async *gemini({ apiKey, model, messages, signal }) {
    const ai = new GoogleGenAI({ apiKey });

    // Gemini expects the conversation to start with a user turn.
    const msgs = [...messages];
    while (msgs.length && msgs[0].role !== "user") msgs.shift();

    const stream = await ai.models.generateContentStream({
      model,
      contents: msgs.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        abortSignal: signal, // verify option name against your installed @google/genai version
      },
    });

    for await (const chunk of stream) {
      if (signal.aborted) break; // belt and braces if abortSignal isn't honoured
      if (chunk.text) yield chunk.text;
    }
  },
};

function friendlyError(err) {
  const status = err?.status ?? err?.code;
  const msg = String(err?.message || err || "Unknown error");
  if (status === 400 && /api key/i.test(msg))
    return "The API key was rejected. Check it in Settings.";
  if (status === 401 || status === 403)
    return "The API key was rejected or lacks access to this model.";
  if (status === 404)
    return "Model not found. Check the model name in Settings.";
  if (status === 429) return "Rate limit or quota reached. Try again shortly.";
  if (/fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network/i.test(msg))
    return "Can't reach the API. Check your internet connection.";
  return msg.length > 300 ? msg.slice(0, 300) + "…" : msg;
}

module.exports = { providers, friendlyError };
