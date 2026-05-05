const { app, BrowserWindow, screen, Tray, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let win;
let tray;
let windowPos = { x: 0, y: 0 };

// 📁 Notes file path
const notesPath = path.join(app.getPath("userData"), "notes.json");

// ⏱️ DOCK BEHAVIOR STATE
let dockState = "EXPANDED"; // EXPANDED | DOCKED | HIDDEN
let idleTimer = null;
let dockTimer = null;
const IDLE_TO_DOCK = 5 * 1000; // 30 seconds
const DOCK_TO_HIDE = 10 * 1000; // 60 seconds

const WINDOW_SIZES = {
  EXPANDED: { width: 420, height: 420 },
  DOCKED: { width: 420, height: 420 }, // Full size, just repositioned
  HIDDEN: { width: 35, height: 120 }, // Compact tab on right edge
};

// ⏱️ IDLE TIMER FUNCTIONS
function resetIdleTimer() {
  // Clear existing timers
  if (idleTimer) clearTimeout(idleTimer);
  if (dockTimer) clearTimeout(dockTimer);

  // Only reset if we're in EXPANDED state
  if (dockState === "EXPANDED") {
    // After 30s idle → DOCK
    idleTimer = setTimeout(() => {
      transitionToDocked();
    }, IDLE_TO_DOCK);
  }
  // If docked, set timer to hide
  else if (dockState === "DOCKED") {
    dockTimer = setTimeout(() => {
      transitionToHidden();
    }, DOCK_TO_HIDE);
  }
}

function transitionToDocked() {
  console.log("🔄 Transitioning to DOCKED state");
  dockState = "DOCKED";

  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  // Move to bottom-right corner (full size, fully visible)
  const newX = width - 420;
  const newY = height - 420;

  win.setSize(WINDOW_SIZES.DOCKED.width, WINDOW_SIZES.DOCKED.height);
  win.setPosition(newX, newY);
  windowPos = { x: newX, y: newY };

  // Notify renderer
  if (win && win.webContents) {
    win.webContents.send("dock-state-changed", { state: "DOCKED" });
  }

  // Set timer for hide
  dockTimer = setTimeout(() => {
    transitionToHidden();
  }, DOCK_TO_HIDE);
}

function transitionToHidden() {
  console.log("🔄 Transitioning to HIDDEN state");
  dockState = "HIDDEN";

  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  // Position at bottom-right corner, tab touching right edge
  const newX = width - 420;
  const newY = height - 420;

  win.setSize(WINDOW_SIZES.HIDDEN.width, WINDOW_SIZES.HIDDEN.height);
  win.setPosition(newX, newY);
  windowPos = { x: newX, y: newY };

  // Notify renderer
  if (win && win.webContents) {
    win.webContents.send("dock-state-changed", { state: "HIDDEN" });
  }
}

function expandWindow() {
  console.log("✨ Restoring to EXPANDED state");
  dockState = "EXPANDED";

  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  // Return to default position (bottom-right area)
  const newX = width - 440;
  const newY = height - 440;

  win.setSize(WINDOW_SIZES.EXPANDED.width, WINDOW_SIZES.EXPANDED.height);
  win.setPosition(newX, newY);
  windowPos = { x: newX, y: newY };

  // Notify renderer
  if (win && win.webContents) {
    win.webContents.send("dock-state-changed", { state: "EXPANDED" });
  }

  // Reset idle timer
  resetIdleTimer();
}

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  win = new BrowserWindow({
    width: 420,
    height: 420,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    x: width - 440,
    y: height - 440,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.setAlwaysOnTop(true, "screen-saver");

  // Initialize window position tracking for fast dragging
  const [x, y] = win.getPosition();
  windowPos = { x, y };

  // Load from dist in production, or from dev server in development
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

  win.webContents.openDevTools();

  // ⏱️ START IDLE TIMER
  resetIdleTimer();

  // Listen for user activity from renderer
  win.webContents.on("before-input-event", (event, input) => {
    // Keyboard or mouse activity detected
    resetIdleTimer();
  });

  win.on("focus", () => {
    resetIdleTimer();
  });

  win.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, "icon.ico"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open JARVIS",
      click: () => {
        win.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("JARVIS Assistant");
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  app.setLoginItemSettings({
    openAtLogin: true,
  });

  createWindow();
  createTray();
});

app.on("before-quit", () => {
  app.isQuiting = true;
});

// =======================
// 🔥 IPC HANDLERS (IMPORTANT)
// =======================

// 🪟 Restore window from dock/hidden
ipcMain.handle("restore-window", () => {
  expandWindow();
});

// 📝 Load Notes
ipcMain.handle("load-notes", () => {
  try {
    if (!fs.existsSync(notesPath)) return [];
    const data = fs.readFileSync(notesPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Load notes error:", err);
    return [];
  }
});

// 📝 Save Notes
ipcMain.handle("save-notes", (_, notes) => {
  try {
    fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
  } catch (err) {
    console.error("Save notes error:", err);
  }
});

// =======================
// 🖱️ WINDOW DRAGGING
// =======================

// Handle window drag (fast movement with cached position)
ipcMain.on("window-drag", (event, { x, y }) => {
  // Only allow dragging in EXPANDED state
  if (dockState === "EXPANDED") {
    windowPos.x += x;
    windowPos.y += y;
    win.setPosition(windowPos.x, windowPos.y);

    // Reset idle timer on drag
    resetIdleTimer();
  }
});
