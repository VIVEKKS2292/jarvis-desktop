import React, { useEffect, useState } from "react";

type Note = {
    id: number;
    text: string;
};

const Notes: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [input, setInput] = useState("");
    const [loaded, setLoaded] = useState(false);

    // 🔥 Load from Electron storage
    useEffect(() => {
        const load = async () => {
            const saved = await window.api.loadNotes();
            setNotes(saved);
            setLoaded(true);
        };
        load();
    }, []);

    // 🔥 Save whenever notes change (after load)
    useEffect(() => {
        if (!loaded) return;

        const save = async () => {
            await window.api.saveNotes(notes);
        };
        save();
    }, [notes, loaded]);

    const addNote = () => {
        if (!input.trim()) return;

        const newNote: Note = {
            id: Date.now(),
            text: input,
        };

        setNotes([newNote, ...notes]);
        setInput("");
    };

    const deleteNote = (id: number) => {
        setNotes(notes.filter((n) => n.id !== id));
    };

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ color: "#00D4FF", fontSize: "24px", margin: "0" }}>📝 Notes</h2>

            {/* Input Section */}
            <div style={{ display: "flex", gap: "8px" }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                    placeholder="Write a quick note..."
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
                    onClick={addNote}
                    style={{
                        padding: "12px 24px",
                        background: "rgba(0,212,255,0.15)",
                        border: "1px solid rgba(0,212,255,0.5)",
                        borderRadius: "8px",
                        color: "#00D4FF",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "14px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 0 8px rgba(0,212,255,0.3)",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.25)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(0,212,255,0.6)";
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.15)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 8px rgba(0,212,255,0.3)";
                        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    }}
                >
                    Add Note
                </button>
            </div>

            {/* Notes List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
                {notes.length === 0 ? (
                    <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "20px" }}>
                        No notes yet...
                    </p>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            style={{
                                background: "rgba(10,15,28,0.5)",
                                backdropFilter: "blur(12px)",
                                padding: "12px 16px",
                                border: "1px solid rgba(0,212,255,0.2)",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                color: "rgba(255,255,255,0.8)",
                                fontSize: "14px",
                                transition: "all 0.2s ease",
                                boxShadow: "inset 0 0 8px rgba(0,212,255,0.05)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                                (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.6)";
                                (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 12px rgba(0,212,255,0.1)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                                (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.5)";
                                (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 8px rgba(0,212,255,0.05)";
                            }}
                        >
                            <span>{note.text}</span>

                            <button
                                onClick={() => deleteNote(note.id)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#ff6b6b",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    transition: "all 0.2s ease",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,107,107,0.2)";
                                    (e.currentTarget as HTMLElement).style.color = "#ff8787";
                                    (e.currentTarget as HTMLElement).style.transform = "scale(1.2)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                    (e.currentTarget as HTMLElement).style.color = "#ff6b6b";
                                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notes;