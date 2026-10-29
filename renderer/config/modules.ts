import type { FC } from "react";
import Shortcuts from "../modules/shortcuts/Shortcuts";
import Notes from "../modules/notes/Notes";
import Weather from "../modules/weather/Weather";
import System from "../modules/system/System";
import Mood from "../modules/mood/Mood";
import Chat from "../modules/chat/Chat"; // was "../modules/chat/chat": wrong case breaks on Linux/CI/macOS
import Settings from "../modules/settings/Settings";

export const moduleMap: Record<string, FC> = {
  shortcuts: Shortcuts,
  chat: Chat,
  notes: Notes,
  weather: Weather,
  system: System,
  mood: Mood,
  settings: Settings, // reached from the ⚙ button in ModuleScreen, not from the hex wheel
};
