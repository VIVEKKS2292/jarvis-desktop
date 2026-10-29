import React, { useState, useEffect } from "react";
import HexMenu from "./components/HexMenu";
import ModuleScreen from "./components/ModuleScreen";
import { ChatProvider } from "./hooks/ChatContext";
import type { DockState } from "./types/global";
import "./styles/dock.css";

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [dockState, setDockState] = useState<DockState>("EXPANDED");

  // Dock state pushed from the main process
  useEffect(() => window.api.onDockStateChanged((d) => setDockState(d.state)), []);

  // Global hotkey: jump straight to chat (the Chat screen focuses its own input)
  useEffect(() => window.api.onFocusChat(() => setActiveModule("chat")), []);

  // The centre "AI core" button used to select "ai-core", which has no module -> stuck on "Loading..."
  const handleSelect = (id: string) => setActiveModule(id === "ai-core" ? "chat" : id);

  const handleRestoreClick = () => {
    void window.api.restoreWindow();
  };

  return (
    <ChatProvider>
      {dockState === "HIDDEN" ? (
        <div className="indicator-tab" onClick={handleRestoreClick}>
          <div className="indicator-icon">J</div>
          <div className="indicator-text">JARVIS</div>
        </div>
      ) : (
        <div className="app-container">
          {!activeModule ? (
            <HexMenu onSelect={handleSelect} />
          ) : (
            <ModuleScreen
              module={activeModule}
              onBack={() => setActiveModule(null)}
              onOpenSettings={() => setActiveModule("settings")}
            />
          )}
        </div>
      )}
    </ChatProvider>
  );
};

export default App;