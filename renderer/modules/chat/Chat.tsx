import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "../../hooks/ChatContext";

const glass: React.CSSProperties = {
    background: "rgba(10,15,28,0.5)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
};

const Chat: React.FC = () => {
    const { messages, busy, error, send, stop, clear } = useChatContext();
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    // Focus on mount, and again whenever the global hotkey summons the HUD
    useEffect(() => {
        inputRef.current?.focus();
        return window.api.onFocusChat(() => inputRef.current?.focus());
    }, []);

    // Keep the newest text in view while streaming
    useEffect(() => {
        endRef.current?.scrollIntoView({ block: "end" });
    }, [messages]);

    const submit = () => {
        const text = input.trim();
        if (!text || busy) return;
        setInput("");
        void send(text);
    };

    return (
        <div style={{ height: "100%", minHeight: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ color: "#00D4FF", fontSize: 20, margin: 0 }}>💬 Chat</h2>
                <button
                    onClick={clear}
                    disabled={busy || messages.length === 0}
                    style={{
                        background: "transparent",
                        border: "1px solid rgba(0,212,255,0.3)",
                        borderRadius: 6,
                        color: "rgba(255,255,255,0.7)",
                        padding: "4px 10px",
                        fontSize: 12,
                        cursor: busy || messages.length === 0 ? "not-allowed" : "pointer",
                        opacity: busy || messages.length === 0 ? 0.4 : 1,
                    }}
                >
                    Clear
                </button>
            </div>

            {/* Messages (plain text only: model output is untrusted, never inject as HTML) */}
            <div
                style={{
                    ...glass,
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    scrollbarWidth: "none",
                }}
            >
                {messages.length === 0 && (
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Ask something...</div>
                )}

                {messages.map((m, i) => {
                    const isUser = m.role === "user";
                    const waiting = busy && !isUser && m.content === "" && i === messages.length - 1;
                    return (
                        <div
                            key={i}
                            style={{
                                alignSelf: isUser ? "flex-end" : "flex-start",
                                maxWidth: "88%",
                                padding: "8px 12px",
                                borderRadius: 10,
                                fontSize: 14,
                                lineHeight: 1.5,
                                textAlign: "left",
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere",
                                color: isUser ? "white" : "#00D4FF",
                                background: isUser ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)",
                                border: `1px solid ${isUser ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                            }}
                        >
                            {waiting ? "…" : m.content}
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            {error && (
                <div
                    style={{
                        fontSize: 12,
                        color: "#ff8a8a",
                        background: "rgba(255,80,80,0.08)",
                        border: "1px solid rgba(255,80,80,0.3)",
                        borderRadius: 8,
                        padding: "6px 10px",
                    }}
                >
                    {error}
                    {/api key/i.test(error) && " Open ⚙ Settings (top right)."}
                </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) submit();
                    }}
                    placeholder="Type your prompt..."
                    style={{
                        flex: 1,
                        minWidth: 0,
                        padding: "10px 14px",
                        background: "rgba(10,15,28,0.5)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "white",
                        fontSize: 14,
                        outline: "none",
                    }}
                />
                <button
                    onClick={busy ? stop : submit}
                    style={{
                        padding: "10px 18px",
                        background: "rgba(10,15,28,0.6)",
                        border: `1.5px solid ${busy ? "rgba(255,138,138,0.7)" : "rgba(0,212,255,0.6)"}`,
                        borderRadius: 8,
                        color: busy ? "#ff8a8a" : "#00D4FF",
                        fontWeight: "bold",
                        fontSize: 14,
                        cursor: "pointer",
                    }}
                >
                    {busy ? "Stop" : "Send"}
                </button>
            </div>
        </div>
    );
};

export default Chat;