import React, { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(
    "[REDACTED]"
)

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
})

const Chat: React.FC = () => {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return

        setLoading(true)
        setOutput("")

        try {
            const result = await model.generateContentStream(input)

            let fullText = ""

            for await (const chunk of result.stream) {
                const chunkText = chunk.text()
                fullText += chunkText
                setOutput(fullText)
            }

        } catch (err) {
            console.error(err)
            setOutput("⚠️ Error fetching response")
        }

        setLoading(false)
        setInput("")
    }

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ color: "#00D4FF", fontSize: "24px", margin: "0 0 10px 0" }}>💬 Chat</h2>

            {/* Output Box - Glassmorphism */}
            <div
                style={{
                    minHeight: "200px",
                    padding: "20px",
                    background: "rgba(10,15,28,0.5)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#00D4FF",
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    boxShadow: "inset 0 0 10px rgba(0,212,255,0.05)",
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 15px rgba(0,212,255,0.1)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 10px rgba(0,212,255,0.05)";
                }}
            >
                {output || "Ask something..."}
            </div>

            {/* Input Section */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your prompt..."
                    style={{
                        flex: 1,
                        padding: "12px 16px",
                        background: "rgba(10,15,28,0.5)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "14px",
                        transition: "all 0.2s ease",
                        boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)",
                    }}
                    onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = "rgba(0,212,255,0.5)";
                        (e.target as HTMLElement).style.boxShadow = "inset 0 0 8px rgba(0,0,0,0.3), 0 0 12px rgba(0,212,255,0.3)";
                    }}
                    onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                        (e.target as HTMLElement).style.boxShadow = "inset 0 0 8px rgba(0,0,0,0.3)";
                    }}
                />

                <button
                    onClick={handleSend}
                    disabled={loading}
                    style={{
                        padding: "12px 24px",
                        background: loading
                            ? "rgba(10,15,28,0.4)"
                            : "rgba(10,15,28,0.6)",
                        border: "1.5px solid rgba(0,212,255,0.6)",
                        borderRadius: "8px",
                        color: "#00D4FF",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        opacity: loading ? 0.6 : 1,
                        boxShadow: loading
                            ? "0 0 8px rgba(0,212,255,0.2)"
                            : "0 0 12px rgba(0,212,255,0.4)",
                        backdropFilter: "blur(8px)",
                        letterSpacing: "0.3px",
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.7)";
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.9)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(0,212,255,0.7), inset 0 0 12px rgba(0,212,255,0.1)";
                            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.6)";
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.6)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(0,212,255,0.4)";
                            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                        }
                    }}
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    )
}

export default Chat