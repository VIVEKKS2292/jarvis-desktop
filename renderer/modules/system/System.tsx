import React, { useEffect, useState } from "react"

type SystemInfo = {
    platform: string
    cpu: string
    cores: number
    totalMem: number
    freeMem: number
    uptime: number
}

const System: React.FC = () => {
    const [info, setInfo] = useState<SystemInfo | null>(null)

    useEffect(() => {
        const data = (window as any).api.getSystemInfo()
        setInfo(data)
    }, [])

    const formatGB = (bytes: number) =>
        (bytes / 1024 / 1024 / 1024).toFixed(2)

    const memoryUsagePercent = info
        ? Math.round(((info.totalMem - info.freeMem) / info.totalMem) * 100)
        : 0

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ color: "#00D4FF", fontSize: "24px", margin: "0" }}>💻 System Info</h2>

            {info ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {/* Platform */}
                    <div
                        style={{
                            padding: "16px",
                            background: "rgba(10,15,28,0.5)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            borderRadius: "10px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.6)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.5)";
                        }}
                    >
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Platform</div>
                        <div style={{ fontSize: "16px", color: "#00D4FF", fontWeight: "bold", marginTop: "4px" }}>
                            {info.platform}
                        </div>
                    </div>

                    {/* CPU */}
                    <div
                        style={{
                            padding: "16px",
                            background: "rgba(10,15,28,0.5)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            borderRadius: "10px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.6)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.5)";
                        }}
                    >
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>CPU</div>
                        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>
                            {info.cpu}
                        </div>
                        <div style={{ fontSize: "12px", color: "rgba(0,212,255,0.7)", marginTop: "4px" }}>
                            {info.cores} Cores
                        </div>
                    </div>

                    {/* Memory */}
                    <div
                        style={{
                            padding: "16px",
                            background: "rgba(10,15,28,0.5)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            borderRadius: "10px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.6)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.5)";
                        }}
                    >
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Total Memory</div>
                        <div style={{ fontSize: "16px", color: "#00D4FF", fontWeight: "bold", marginTop: "4px" }}>
                            {formatGB(info.totalMem)} GB
                        </div>
                    </div>

                    {/* Free Memory */}
                    <div
                        style={{
                            padding: "16px",
                            background: "rgba(10,15,28,0.5)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            borderRadius: "10px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.6)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.5)";
                        }}
                    >
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Free Memory</div>
                        <div style={{ fontSize: "16px", color: "#00D4FF", fontWeight: "bold", marginTop: "4px" }}>
                            {formatGB(info.freeMem)} GB
                        </div>
                        <div style={{
                            marginTop: "8px",
                            height: "6px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "3px",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                height: "100%",
                                width: `${memoryUsagePercent}%`,
                                background: `linear-gradient(90deg, #00D4FF, #0099FF)`,
                                transition: "width 0.3s ease",
                            }} />
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(0,212,255,0.7)", marginTop: "4px" }}>
                            {memoryUsagePercent}% used
                        </div>
                    </div>

                    {/* Uptime */}
                    <div
                        style={{
                            padding: "16px",
                            background: "rgba(10,15,28,0.5)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            borderRadius: "10px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.6)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(10,15,28,0.5)";
                        }}
                    >
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Uptime</div>
                        <div style={{ fontSize: "16px", color: "#00D4FF", fontWeight: "bold", marginTop: "4px" }}>
                            {(info.uptime / 3600).toFixed(1)} hrs
                        </div>
                    </div>
                </div>
            ) : (
                <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading system information...</p>
            )}
        </div>
    )
}

export default System