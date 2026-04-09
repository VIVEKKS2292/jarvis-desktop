import React, { useState } from "react"

type Mood = {
    emoji: string
    text: string
}

const moods: Mood[] = [
    { emoji: "😄", text: "Feeling Happy" },
    { emoji: "😴", text: "Feeling Sleepy" },
    { emoji: "🤖", text: "In Focus Mode" },
    { emoji: "🔥", text: "Highly Motivated" },
    { emoji: "😎", text: "Chill Mode" },
    { emoji: "💡", text: "Creative Thinking" },
    { emoji: "⚡", text: "Energy Boost" },
    { emoji: "😶‍🌫️", text: "Lost in Thoughts" },
]

const getRandomMood = (): Mood => {
    return moods[Math.floor(Math.random() * moods.length)]
}

const Mood: React.FC = () => {
    const [currentMood, setCurrentMood] = useState<Mood>(getRandomMood())
    const [isHovering, setIsHovering] = useState(false)

    const changeMood = () => {
        setCurrentMood(getRandomMood())
    }

    return (
        <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <h2 style={{ color: "#00D4FF", fontSize: "24px", margin: "0" }}>🎭 Mood</h2>

            <div
                style={{
                    padding: "40px",
                    background: isHovering ? "rgba(0,212,255,0.15)" : "rgba(10,15,28,0.5)",
                    backdropFilter: "blur(16px)",
                    border: isHovering ? "2px solid rgba(0,212,255,0.5)" : "1px solid rgba(0,212,255,0.2)",
                    borderRadius: "20px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    boxShadow: isHovering
                        ? "0 0 30px rgba(0,212,255,0.4), inset 0 0 20px rgba(0,212,255,0.1)"
                        : "0 0 15px rgba(0,212,255,0.1), inset 0 0 10px rgba(0,212,255,0.05)",
                    transform: isHovering ? "scale(1.08)" : "scale(1)",
                }}
                onClick={changeMood}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div style={{
                    fontSize: "80px",
                    transition: "transform 0.3s ease",
                    transform: isHovering ? "scale(1.15) rotate(5deg)" : "scale(1) rotate(0deg)",
                }}>
                    {currentMood.emoji}
                </div>

                <div style={{
                    marginTop: "20px",
                    fontSize: "20px",
                    color: "#00D4FF",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                }}>
                    {currentMood.text}
                </div>
            </div>

            <p style={{
                marginTop: "10px",
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                textAlign: "center",
                maxWidth: "200px",
            }}>
                Click to discover a different mood
            </p>
        </div>
    )
}

export default Mood