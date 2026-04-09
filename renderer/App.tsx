import React, { useState, useEffect } from "react"
import HexMenu from "./components/HexMenu"
import ModuleScreen from "./components/ModuleScreen"
import "./styles/dock.css"

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [dockState, setDockState] = useState<"EXPANDED" | "DOCKED" | "HIDDEN">("EXPANDED")

  useEffect(() => {
    // Listen for dock state changes from main process
    const unsubscribe = window.ipcRenderer?.on("dock-state-changed", (data: any) => {
      console.log("📊 Dock state changed:", data.state);
      setDockState(data.state);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Reset idle timer on any user interaction
  const handleUserActivity = () => {
    // Activity is tracked by main process
  };

  const handleRestoreClick = async () => {
    if (window.ipcRenderer) {
      await window.ipcRenderer.invoke("restore-window");
    }
  };

  if (dockState === "HIDDEN") {
    return (
      <div className="indicator-tab" onClick={handleRestoreClick}>
        <div className="indicator-icon">J</div>
        <div className="indicator-text">JARVIS</div>
      </div>
    );
  }

  return (
    <div className="app-container" onClick={handleUserActivity}>
      {!activeModule ? (
        <HexMenu onSelect={setActiveModule} />
      ) : (
        <ModuleScreen
          module={activeModule}
          onBack={() => setActiveModule(null)}
        />
      )}
    </div>
  );
}

export default App