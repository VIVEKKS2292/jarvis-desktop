// Sandbox-safe preload: only `electron` modules are used (no os / shell here).
const { contextBridge, ipcRenderer } = require("electron");

// Subscribe to a main->renderer channel and get back an unsubscribe function
const subscribe = (channel, cb) => {
  const handler = (_event, data) => cb(data);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
};

contextBridge.exposeInMainWorld("api", {
  // --- existing API (same names as before) ---
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  getSystemInfo: () => ipcRenderer.invoke("get-system-info"), // NOW ASYNC
  loadNotes: () => ipcRenderer.invoke("load-notes"),
  saveNotes: (notes) => ipcRenderer.invoke("save-notes", notes),
  windowDrag: (x, y) => ipcRenderer.send("window-drag", { x, y }),
  restoreWindow: () => ipcRenderer.invoke("restore-window"),

  // --- events ---
  onDockStateChanged: (cb) => subscribe("dock-state-changed", cb),
  onFocusChat: (cb) => subscribe("focus-chat", () => cb()),
  setKeepAwake: (on) => ipcRenderer.send("ui:keep-awake", !!on),

  // --- chat ---
  chat: {
    send: (id, messages) => ipcRenderer.invoke("chat:send", { id, messages }),
    cancel: (id) => ipcRenderer.send("chat:cancel", id),
    test: (provider) => ipcRenderer.invoke("chat:test", provider),
    onEvent: (cb) => subscribe("chat:event", cb),
  },

  // --- settings (API keys are write-only) ---
  settings: {
    get: () => ipcRenderer.invoke("settings:get"),
    update: (patch) => ipcRenderer.invoke("settings:update", patch),
    setKey: (provider, key) =>
      ipcRenderer.invoke("settings:setKey", provider, key),
    clearKey: (provider) => ipcRenderer.invoke("settings:clearKey", provider),
  },
});

// LEGACY shim so existing renderer code keeps working. Remove once the renderer
// uses window.api.onDockStateChanged / window.api.restoreWindow instead.
contextBridge.exposeInMainWorld("ipcRenderer", {
  on: (channel, callback) => {
    if (["dock-state-changed", "focus-chat"].includes(channel)) {
      return subscribe(channel, callback); // now returns an unsubscribe function
    }
  },
  invoke: (channel, ...args) => {
    if (["restore-window"].includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
  },
});
