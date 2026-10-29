import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "./types/global";

const MAX_HISTORY = 20;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeId = useRef<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  useEffect(
    () =>
      window.api.chat.onEvent((ev) => {
        if (ev.id !== activeId.current) return;

        if (ev.type === "chunk") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + ev.text },
            ];
          });
          return;
        }

        activeId.current = null;
        setBusy(false);
        if (ev.type === "error") {
          setError(ev.message);
          // Drop the empty assistant bubble if nothing streamed before the error
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return last?.role === "assistant" && last.content === ""
              ? prev.slice(0, -1)
              : prev;
          });
        }
      }),
    [],
  );

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || activeId.current) return;

    const id = crypto.randomUUID();
    const history: ChatMessage[] = [
      ...messagesRef.current,
      { role: "user", content: trimmed },
    ];

    // Last N turns only, and never start on an assistant turn
    const toSend = history.slice(-MAX_HISTORY);
    while (toSend.length && toSend[0].role === "assistant") toSend.shift();

    activeId.current = id;
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    setError(null);

    try {
      const res = await window.api.chat.send(id, toSend);
      if (!res.ok) throw new Error(res.error || "Request failed");
    } catch (e) {
      activeId.current = null;
      setBusy(false);
      setError(e instanceof Error ? e.message : String(e));
      setMessages((prev) => prev.slice(0, -1)); // remove the empty assistant bubble
    }
  }, []);

  const stop = useCallback(() => {
    if (activeId.current) window.api.chat.cancel(activeId.current);
  }, []);

  const clear = useCallback(() => {
    if (activeId.current) return;
    setMessages([]);
    setError(null);
  }, []);

  return { messages, busy, error, send, stop, clear };
}
