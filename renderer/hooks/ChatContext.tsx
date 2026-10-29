import React, { createContext, useContext } from "react";
import { useChat } from "../UseChat";

type ChatApi = ReturnType<typeof useChat>;

const ChatCtx = createContext<ChatApi | null>(null);

// Lives in App so the conversation (and any in-flight stream) survives
// the Chat screen unmounting when the user goes back to the hex menu.
export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const chat = useChat();
  return <ChatCtx.Provider value={chat}>{children}</ChatCtx.Provider>;
};

export function useChatContext(): ChatApi {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("useChatContext must be used inside <ChatProvider>");
  return ctx;
}