const shortcuts = [
    { name: "YouTube", url: "https://youtube.com" },
    { name: "GitHub", url: "https://github.com/VIVEKKS2292" },
    { name: "ChatGPT", url: "https://chat.openai.com" },
];

const Shortcuts = () => {
    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ color: "#00D4FF", fontSize: "24px", margin: "0 0 20px 0" }}>🔗 Shortcuts</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "12px",
                }}
            >
                {shortcuts.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            padding: "16px",
                            background: "rgba(10,15,28,0.5)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            borderRadius: "10px",
                            cursor: "pointer",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "rgba(255,255,255,0.9)",
                            transition: "all 0.3s ease",
                            boxShadow: "inset 0 0 8px rgba(0,212,255,0.05)",
                        }}
                        onClick={() => window.api.openExternal(item.url)}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.15)";
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.5)";
                            (e.currentTarget as HTMLElement).style.color = "#00D4FF";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(0,212,255,0.4), inset 0 0 12px rgba(0,212,255,0.1)";
                            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.5)";
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 8px rgba(0,212,255,0.05)";
                            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                        }}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shortcuts;