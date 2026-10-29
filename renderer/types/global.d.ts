export {};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatEvent = { id: string } & (
  | { type: "chunk"; text: string }
  | { type: "done" }
  | { type: "error"; message: string }
);

export type PublicSettings = {
  version: number;
  provider: string;
  model: string;
  hotkey: string;
  launchAtLogin: boolean;
  providers: string[];
  hasKey: Record<string, boolean>;
  secure: { available: boolean; weak: boolean };
};

export type Note = { id: number; text: string };

export type DockState = "EXPANDED" | "DOCKED" | "HIDDEN";

declare global {
  interface Window {
    api: {
      openExternal(url: string): Promise<boolean>;
      getSystemInfo(): Promise<{
        platform: string;
        cpu: string;
        cores: number;
        totalMem: number;
        freeMem: number;
        uptime: number;
      }>;
      loadNotes(): Promise<Note[]>;
      saveNotes(notes: Note[]): Promise<void>;
      windowDrag(x: number, y: number): void;
      restoreWindow(): Promise<void>;

      onDockStateChanged(cb: (d: { state: DockState }) => void): () => void;
      onFocusChat(cb: () => void): () => void;
      setKeepAwake(on: boolean): void;

      chat: {
        send(
          id: string,
          messages: ChatMessage[],
        ): Promise<{ ok: boolean; error?: string }>;
        cancel(id: string): void;
        test(provider?: string): Promise<{ ok: boolean; error?: string }>;
        onEvent(cb: (e: ChatEvent) => void): () => void;
      };

      settings: {
        get(): Promise<PublicSettings>;
        update(
          patch: Partial<
            Pick<
              PublicSettings,
              "provider" | "model" | "hotkey" | "launchAtLogin"
            >
          >,
        ): Promise<{ settings: PublicSettings; hotkeyError: string | null }>;
        setKey(
          provider: string,
          key: string,
        ): Promise<{ ok: boolean; error?: string; settings?: PublicSettings }>;
        clearKey(
          provider: string,
        ): Promise<{ ok: boolean; settings: PublicSettings }>;
      };
    };
  }
}
