// Preload script for IPC communication

const { contextBridge, shell, ipcRenderer } = require("electron");
const os = require("os");

contextBridge.exposeInMainWorld("api", {
  openExternal: (url) => shell.openExternal(url),

  getSystemInfo: () => {
    return {
      platform: os.platform(),
      cpu: os.cpus()[0].model,
      cores: os.cpus().length,
      totalMem: os.totalmem(),
      freeMem: os.freemem(),
      uptime: os.uptime(),
    };
  },

  loadNotes: () => ipcRenderer.invoke("load-notes"),
  saveNotes: (notes) => ipcRenderer.invoke("save-notes", notes),

  windowDrag: (x, y) => ipcRenderer.send("window-drag", { x, y }),

  // 🪟 Dock behavior
  restoreWindow: () => ipcRenderer.invoke("restore-window"),
});

// Expose ipcRenderer for event listening
contextBridge.exposeInMainWorld("ipcRenderer", {
  on: (channel, callback) => {
    // Filter channels for security
    const validChannels = ["dock-state-changed"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, data) => callback(data));
    }
  },
  invoke: (channel, ...args) => {
    const validChannels = ["restore-window"];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
  },
});
