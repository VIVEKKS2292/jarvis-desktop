import React from "react";
import { moduleMap } from "../config/modules";

const ModuleScreen = ({
    module,
    onBack,
}: {
    module: string;
    onBack: () => void;
}) => {
    const ActiveComponent = moduleMap[module];

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: "#0A0F1C",
                color: "white",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                animation: "slideIn 0.3s ease-out",
            }}
        >
            {/* 🎨 GLASSMORPHISM PANEL */}
            <div
                style={{
                    width: "90%",
                    height: "80%",
                    background: "rgba(10,15,28,0.7)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    boxShadow: "0 0 30px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.05)",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    hover: {
                        borderColor: "rgba(255,255,255,0.2)",
                    },
                } as any}
            >
                {/* 🔵 HEADER WITH BACK BUTTON */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                        paddingBottom: "15px",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    <button
                        onClick={onBack}
                        style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "white",
                            background: "rgba(0,212,255,0.1)",
                            border: "1px solid rgba(0,212,255,0.3)",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                        }}
                        onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.background = "rgba(0,212,255,0.2)";
                            (e.target as HTMLElement).style.boxShadow = "0 0 12px rgba(0,212,255,0.5)";
                            (e.target as HTMLElement).style.color = "#00D4FF";
                            (e.target as HTMLElement).style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.background = "rgba(0,212,255,0.1)";
                            (e.target as HTMLElement).style.boxShadow = "none";
                            (e.target as HTMLElement).style.color = "white";
                            (e.target as HTMLElement).style.transform = "scale(1)";
                        }}
                    >
                        ←
                    </button>
                </div>

                {/* 📋 CONTENT AREA WITH CUSTOM SCROLLBAR */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        paddingRight: "8px",
                        scrollBehavior: "smooth",
                        WebkitAppRegion: "no-drag",
                    } as any}
                    className="custom-scrollbar"
                >
                    {ActiveComponent ? (
                        <ActiveComponent />
                    ) : (
                        <div
                            style={{
                                color: "rgba(255,255,255,0.5)",
                                textAlign: "center",
                                padding: "40px 20px",
                                fontSize: "16px",
                            }}
                        >
                            Loading...
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar {
                    scrollbar-width: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ModuleScreen;