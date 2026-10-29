import React, { useEffect, useState } from "react";
import type { PublicSettings } from "../../types/global";

type Status = { kind: "ok" | "err"; text: string } | null;

const card: React.CSSProperties = {
    padding: 14,
    background: "rgba(10,15,28,0.5)",
    border: "1px solid rgba(0,212,255,0.2)",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
};
const label: React.CSSProperties = { fontSize: 12, color: "rgba(255,255,255,0.6)" };
const field: React.CSSProperties = {
    padding: "8px 10px",
    background: "rgba(10,15,28,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 6,
    color: "white",
    fontSize: 13,
    outline: "none",
    minWidth: 0,
};
const btn: React.CSSProperties = {
    padding: "8px 12px",
    background: "rgba(0,212,255,0.1)",
    border: "1px solid rgba(0,212,255,0.5)",
    borderRadius: 6,
    color: "#00D4FF",
    fontSize: 13,
    cursor: "pointer",
};

const pretty = (accel: string) => accel.replace("Control", "Ctrl").replace("Super", "Win/Cmd");

// Convert a keydown into an Electron accelerator string, or null if the combo isn't complete yet
function acceleratorFromEvent(e: React.KeyboardEvent): string | null {
    const mods: string[] = [];
    if (e.ctrlKey) mods.push("Control");
    if (e.altKey) mods.push("Alt");
    if (e.shiftKey) mods.push("Shift");
    if (e.metaKey) mods.push("Super");

    let key: string | null = null;
    if (/^Key[A-Z]$/.test(e.code)) key = e.code.slice(3);
    else if (/^Digit[0-9]$/.test(e.code)) key = e.code.slice(5);
    else if (/^F([1-9]|1[0-2])$/.test(e.code)) key = e.code;
    else if (e.code === "Space") key = "Space";
    else if (/^Arrow(Up|Down|Left|Right)$/.test(e.code)) key = e.code.slice(5);
    if (!key) return null;

    const isFunctionKey = /^F\d+$/.test(key);
    if (mods.length === 0 && !isFunctionKey) return null; // require a modifier for normal keys
    return [...mods, key].join("+");
}

const Msg = ({ s }: { s: Status }) =>
    s ? (
        <div style={{ fontSize: 12, color: s.kind === "ok" ? "#6ee7a8" : "#ff8a8a" }}>{s.text}</div>
    ) : null;

const Settings: React.FC = () => {
    const [s, setS] = useState<PublicSettings | null>(null);
    const [model, setModel] = useState("");
    const [keyInput, setKeyInput] = useState("");
    const [keyMsg, setKeyMsg] = useState<Status>(null);
    const [modelMsg, setModelMsg] = useState<Status>(null);
    const [hotkeyMsg, setHotkeyMsg] = useState<Status>(null);
    const [capturing, setCapturing] = useState(false);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        window.api.settings.get().then((v) => {
            setS(v);
            setModel(v.model);
        });
        // Don't dock/hide the HUD while the user is configuring things
        window.api.setKeepAwake(true);
        return () => window.api.setKeepAwake(false);
    }, []);

    if (!s) return <div style={{ color: "rgba(255,255,255,0.5)" }}>Loading settings...</div>;

    const apply = async (patch: Parameters<typeof window.api.settings.update>[0]) => {
        const res = await window.api.settings.update(patch);
        setS(res.settings);
        return res;
    };

    const saveModel = async () => {
        if (model.trim() === s.model) return;
        const res = await apply({ model });
        setModel(res.settings.model); // falls back to the saved value if the input was invalid
        setModelMsg(
            res.settings.model === model.trim()
                ? { kind: "ok", text: "Model saved." }
                : { kind: "err", text: "Invalid model name." }
        );
    };

    const saveKey = async () => {
        if (!keyInput.trim()) return;
        const res = await window.api.settings.setKey(s.provider, keyInput);
        if (res.ok && res.settings) {
            setS(res.settings);
            setKeyInput("");
            setKeyMsg({ kind: "ok", text: "Key saved securely." });
        } else {
            setKeyMsg({ kind: "err", text: res.error || "Could not save the key." });
        }
    };

    const removeKey = async () => {
        const res = await window.api.settings.clearKey(s.provider);
        setS(res.settings);
        setKeyMsg({ kind: "ok", text: "Key removed." });
    };

    const testKey = async () => {
        setTesting(true);
        setKeyMsg(null);
        const res = await window.api.chat.test(s.provider);
        setTesting(false);
        setKeyMsg(res.ok ? { kind: "ok", text: "Connection works ✓" } : { kind: "err", text: res.error || "Test failed." });
    };

    const onHotkeyKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.key === "Escape") {
            setCapturing(false);
            return;
        }
        const accel = acceleratorFromEvent(e);
        if (!accel) return; // keep waiting for a full combination
        setCapturing(false);
        const res = await apply({ hotkey: accel });
        setHotkeyMsg(
            res.hotkeyError
                ? { kind: "err", text: res.hotkeyError }
                : { kind: "ok", text: `Hotkey set to ${pretty(accel)}` }
        );
    };

    const hasKey = !!s.hasKey[s.provider];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
            <h2 style={{ color: "#00D4FF", fontSize: 20, margin: 0 }}>⚙ Settings</h2>

            {!s.secure.available && (
                <div style={{ ...card, borderColor: "rgba(255,80,80,0.4)", color: "#ff8a8a", fontSize: 12 }}>
                    Secure storage isn't available on this system, so API keys can't be saved.
                </div>
            )}
            {s.secure.available && s.secure.weak && (
                <div style={{ ...card, borderColor: "rgba(250,204,21,0.4)", color: "#facc15", fontSize: 12 }}>
                    No system keyring detected. Your key is stored with weak protection.
                </div>
            )}

            <div style={card}>
                <span style={label}>Provider</span>
                <select
                    value={s.provider}
                    onChange={(e) => apply({ provider: e.target.value })}
                    style={field}
                >
                    {s.providers.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                <span style={label}>Model</span>
                <input
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    onBlur={saveModel}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    style={field}
                    spellCheck={false}
                />
                <Msg s={modelMsg} />
            </div>

            <div style={card}>
                <span style={label}>API key {hasKey ? "· saved ✓" : "· not set"}</span>
                <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder={hasKey ? "Paste a new key to replace it" : "Paste your API key"}
                    style={field}
                    autoComplete="off"
                    spellCheck={false}
                />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={btn} onClick={saveKey} disabled={!keyInput.trim()}>
                        {hasKey ? "Replace" : "Save"}
                    </button>
                    <button style={btn} onClick={testKey} disabled={!hasKey || testing}>
                        {testing ? "Testing…" : "Test"}
                    </button>
                    {hasKey && (
                        <button style={{ ...btn, borderColor: "rgba(255,138,138,0.5)", color: "#ff8a8a" }} onClick={removeKey}>
                            Remove
                        </button>
                    )}
                </div>
                <Msg s={keyMsg} />
            </div>

            <div style={card}>
                <span style={label}>Global hotkey</span>
                <input
                    readOnly
                    value={capturing ? "Press a key combination… (Esc to cancel)" : pretty(s.hotkey)}
                    onFocus={() => {
                        setCapturing(true);
                        setHotkeyMsg(null);
                    }}
                    onBlur={() => setCapturing(false)}
                    onKeyDown={onHotkeyKeyDown}
                    style={{ ...field, cursor: "pointer", textAlign: "center" }}
                />
                <Msg s={hotkeyMsg} />
            </div>

            <label style={{ ...card, flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                <input
                    type="checkbox"
                    checked={s.launchAtLogin}
                    onChange={(e) => apply({ launchAtLogin: e.target.checked })}
                />
                <span style={{ fontSize: 13 }}>
                    Launch at login <span style={label}>(installed builds only)</span>
                </span>
            </label>
        </div>
    );
};

export default Settings;