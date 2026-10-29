const {
  app,
  BrowserWindow,
  screen,
  Tray,
  Menu,
  ipcMain,
  globalShortcut,
  shell,
} = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const settings = require("./settings");
const { providers, friendlyError } = require("./llm");

// Dev mode: run with NODE_ENV=development (see the cross-env script in package.json)
const isDev = !app.isPackaged && process.env.NODE_ENV === "development";

let win;
let tray;
let isQuitting = false;
let windowPos = { x: 0, y: 0 };

// ⏱️ DOCK BEHAVIOR STATE
let dockState = "EXPANDED"; // EXPANDED | DOCKED | HIDDEN
let idleTimer = null;
let dockTimer = null;
const IDLE_TO_DOCK = 30 * 1000;
const DOCK_TO_HIDE = 60 * 1000;

const WINDOW_SIZES = {
  EXPANDED: { width: 420, height: 420 },
  DOCKED: { width: 420, height: 420 }, // Full size, just repositioned
  HIDDEN: { width: 35, height: 120 }, // Compact tab on right edge
};

// Don't dock/hide while a reply is streaming or the renderer asks us to stay awake
let keepAwake = false;
const activeChats = new Map(); // requestId -> AbortController
const isBusy = () => keepAwake || activeChats.size > 0;

// =======================
// 🪟 WINDOW GEOMETRY
// =======================

// Work area of whichever display the window is currently on (multi-monitor safe)
function workArea() {
  const display =
    win && !win.isDestroyed()
      ? screen.getDisplayMatching(win.getBounds())
      : screen.getPrimaryDisplay();
  return display.workArea;
}

function placeWindow(size, xMargin, y) {
  const wa = workArea();
  const x = wa.x + wa.width - size.width - xMargin;
  win.setSize(size.width, size.height);
  win.setPosition(x, y(wa));
  windowPos = { x, y: y(wa) };
}

// ⏱️ IDLE TIMER FUNCTIONS
function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  if (dockTimer) clearTimeout(dockTimer);

  if (dockState === "EXPANDED") {
    idleTimer = setTimeout(() => {
      if (isBusy()) return resetIdleTimer();
      transitionToDocked();
    }, IDLE_TO_DOCK);
  } else if (dockState === "DOCKED") {
    dockTimer = setTimeout(() => {
      if (isBusy()) return resetIdleTimer();
      transitionToHidden();
    }, DOCK_TO_HIDE);
  }
}

function notifyDockState() {
  if (win && !win.isDestroyed()) {
    win.webContents.send("dock-state-changed", { state: dockState });
  }
}

function transitionToDocked() {
  if (!win || win.isDestroyed()) return;
  dockState = "DOCKED";
  const s = WINDOW_SIZES.DOCKED;
  placeWindow(s, 0, (wa) => wa.y + wa.height - s.height);
  notifyDockState();
  resetIdleTimer(); // starts the DOCKED -> HIDDEN timer
}

function transitionToHidden() {
  if (!win || win.isDestroyed()) return;
  dockState = "HIDDEN";
  const s = WINDOW_SIZES.HIDDEN;
  // Tab touches the right edge of the screen
  placeWindow(s, 0, (wa) => wa.y + wa.height - 420);
  notifyDockState();
}

function expandWindow() {
  if (!win || win.isDestroyed()) return;
  dockState = "EXPANDED";
  const s = WINDOW_SIZES.EXPANDED;
  placeWindow(s, 20, (wa) => wa.y + wa.height - s.height - 20);
  notifyDockState();
  resetIdleTimer();
}

// Bring the HUD up from any state and focus the chat input
function summon() {
  if (!win || win.isDestroyed()) return;
  if (dockState !== "EXPANDED" || !win.isVisible()) expandWindow();
  win.show();
  win.focus();
  win.webContents.send("focus-chat");
}

function toggleWindow() {
  if (win.isVisible() && dockState === "EXPANDED" && win.isFocused()) {
    transitionToHidden();
  } else {
    summon();
  }
}

// =======================
// ⌨️ GLOBAL HOTKEY
// =======================

function applyHotkey() {
  globalShortcut.unregisterAll();
  const accel = settings.load().hotkey;
  try {
    if (globalShortcut.register(accel, toggleWindow)) return { ok: true };
    return {
      ok: false,
      error: `"${accel}" is invalid or already used by another app.`,
    };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
}

// =======================
// 🪟 WINDOW + TRAY
// =======================

function createWindow() {
  const wa = screen.getPrimaryDisplay().workArea;

  win = new BrowserWindow({
    width: 420,
    height: 420,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    x: wa.x + wa.width - 440,
    y: wa.y + wa.height - 440,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.setAlwaysOnTop(true, "screen-saver");

  const [x, y] = win.getPosition();
  windowPos = { x, y };

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

  // The app never needs to open new windows or navigate away from itself
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (e) => e.preventDefault());

  resetIdleTimer();
  win.webContents.on("before-input-event", () => resetIdleTimer());
  win.on("focus", () => resetIdleTimer());

  win.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, "icon.ico"));
  tray.setToolTip("JARVIS Assistant");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Open JARVIS", click: summon },
      {
        label: "Quit",
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]),
  );
  tray.on("click", summon);
}

// =======================
// 🚀 APP LIFECYCLE
// =======================

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", summon);

  app.whenReady().then(() => {
    // Only touch login items in packaged builds, and only per the user's setting
    if (app.isPackaged) {
      app.setLoginItemSettings({ openAtLogin: settings.load().launchAtLogin });
    }
    createWindow();
    createTray();
    const hk = applyHotkey();
    if (!hk.ok) console.warn("Hotkey:", hk.error);
  });

  app.on("before-quit", () => {
    isQuitting = true;
  });
  app.on("will-quit", () => globalShortcut.unregisterAll());
}

// =======================
// 💬 CHAT (streaming)
// =======================

function validMessages(m) {
  return (
    Array.isArray(m) &&
    m.length > 0 &&
    m.length <= 50 &&
    m[m.length - 1].role === "user" &&
    m.every(
      (x) =>
        x &&
        (x.role === "user" || x.role === "assistant") &&
        typeof x.content === "string" &&
        x.content.length > 0 &&
        x.content.length < 20000,
    )
  );
}

ipcMain.handle("chat:send", (event, payload) => {
  const { id, messages } = payload || {};
  if (typeof id !== "string" || id.length > 100 || !validMessages(messages)) {
    return { ok: false, error: "Invalid request." };
  }

  const s = settings.load();
  const provider = providers[s.provider];
  const apiKey = settings.getKey(s.provider);
  if (!provider) return { ok: false, error: "Unknown provider." };
  if (!apiKey)
    return { ok: false, error: "No API key set. Open Settings to add one." };

  // One conversation at a time: cancel anything still running
  for (const c of activeChats.values()) c.abort();

  const ctrl = new AbortController();
  activeChats.set(id, ctrl);
  const sender = event.sender;
  const emit = (data) => {
    if (!sender.isDestroyed()) sender.send("chat:event", { id, ...data });
  };

  (async () => {
    try {
      for await (const text of provider({
        apiKey,
        model: s.model,
        messages,
        signal: ctrl.signal,
      })) {
        emit({ type: "chunk", text });
      }
      emit({ type: "done" });
    } catch (err) {
      emit(
        ctrl.signal.aborted
          ? { type: "done" }
          : { type: "error", message: friendlyError(err) },
      );
    } finally {
      activeChats.delete(id);
      resetIdleTimer(); // restart the idle countdown after the reply finishes
    }
  })();

  return { ok: true }; // stream arrives via "chat:event"
});

ipcMain.on("chat:cancel", (_e, id) => {
  if (typeof id === "string") activeChats.get(id)?.abort();
});

ipcMain.handle("chat:test", async (_e, providerName) => {
  const name =
    typeof providerName === "string" ? providerName : settings.load().provider;
  const provider = providers[name];
  if (!provider) return { ok: false, error: "Unknown provider." };
  const apiKey = settings.getKey(name);
  if (!apiKey) return { ok: false, error: "No API key saved." };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  let got = false;
  try {
    for await (const _ of provider({
      apiKey,
      model: settings.load().model,
      messages: [{ role: "user", content: "Reply with the single word OK." }],
      signal: ctrl.signal,
    })) {
      got = true;
      break;
    }
    if (got) return { ok: true };
    return {
      ok: false,
      error: ctrl.signal.aborted ? "Timed out." : "No response from the model.",
    };
  } catch (err) {
    return { ok: false, error: friendlyError(err) };
  } finally {
    clearTimeout(timer);
  }
});

// =======================
// ⚙️ SETTINGS
// =======================

ipcMain.handle("settings:get", () => settings.publicView());

ipcMain.handle("settings:update", async (_e, patch) => {
  const clean = settings.sanitize(patch);
  const prevHotkey = settings.load().hotkey;
  let hotkeyError = null;

  await settings.update(clean);

  if ("hotkey" in clean) {
    const r = applyHotkey();
    if (!r.ok) {
      hotkeyError = r.error;
      await settings.update({ hotkey: prevHotkey }); // roll back to the working one
      applyHotkey();
    }
  }
  if ("launchAtLogin" in clean && app.isPackaged) {
    app.setLoginItemSettings({ openAtLogin: clean.launchAtLogin });
  }
  return { settings: settings.publicView(), hotkeyError };
});

ipcMain.handle("settings:setKey", async (_e, provider, key) => {
  try {
    await settings.setKey(provider, key);
    return { ok: true, settings: settings.publicView() };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
});

ipcMain.handle("settings:clearKey", async (_e, provider) => {
  await settings.clearKey(provider);
  return { ok: true, settings: settings.publicView() };
});

// =======================
// 🔥 OTHER IPC HANDLERS
// =======================

ipcMain.handle("restore-window", () => expandWindow());

ipcMain.on("ui:keep-awake", (_e, on) => {
  keepAwake = on === true;
  if (!keepAwake) resetIdleTimer();
});

// Only http(s) links may be opened in the system browser
ipcMain.handle("open-external", (_e, url) => {
  try {
    const u = new URL(String(url));
    if (u.protocol === "https:" || u.protocol === "http:") {
      shell.openExternal(u.toString());
      return true;
    }
  } catch {}
  return false;
});

// os.* lives here now because a sandboxed preload can't require("os")
ipcMain.handle("get-system-info", () => ({
  platform: os.platform(),
  cpu: os.cpus()[0]?.model ?? "unknown",
  cores: os.cpus().length,
  totalMem: os.totalmem(),
  freeMem: os.freemem(),
  uptime: os.uptime(),
}));

// 📝 Notes
const notesPath = () => path.join(app.getPath("userData"), "notes.json");

ipcMain.handle("load-notes", async () => {
  try {
    return JSON.parse(await fs.promises.readFile(notesPath(), "utf-8"));
  } catch (err) {
    if (err.code !== "ENOENT") console.error("Load notes error:", err);
    return [];
  }
});

ipcMain.handle("save-notes", async (_e, notes) => {
  try {
    if (!Array.isArray(notes) || JSON.stringify(notes).length > 5_000_000) {
      throw new Error("Invalid notes payload");
    }
    await settings.writeJsonAtomic(notesPath(), notes);
  } catch (err) {
    console.error("Save notes error:", err);
  }
});

// =======================
// 🖱️ WINDOW DRAGGING
// =======================

ipcMain.on("window-drag", (_e, delta) => {
  const { x, y } = delta || {};
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  if (dockState === "EXPANDED" && win && !win.isDestroyed()) {
    windowPos.x += x;
    windowPos.y += y;
    win.setPosition(Math.round(windowPos.x), Math.round(windowPos.y));
    resetIdleTimer();
  }
});
