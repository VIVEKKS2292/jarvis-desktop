export {};

declare global {
  interface Window {
    api: {
      openExternal: (url: string) => void;

      // 📝 Notes (FIXED → async)
      loadNotes: () => Promise<{ id: number; text: string }[]>;
      saveNotes: (notes: { id: number; text: string }[]) => Promise<void>;

      // 💻 System
      getSystemInfo: () => {
        platform: string;
        cpu: string;
        cores: number;
        totalMem: number;
        freeMem: number;
        uptime: number;
      };

      // 🖱️ Window
      windowDrag: (x: number, y: number) => void;

      // 🪟 Dock behavior
      restoreWindow: () => Promise<void>;
    };

    // 🪟 IPC Renderer for event listening
    ipcRenderer: {
      on: (channel: string, callback: (data: any) => void) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}
