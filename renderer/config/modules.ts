import Shortcuts from "../modules/shortcuts/Shortcuts";
import Notes from "../modules/notes/Notes";
import Weather from "../modules/weather/Weather";
import System from "../modules/system/System";
import Mood from "../modules/mood/Mood";
import Chat from "../modules/chat/chat";

export const moduleMap: Record<string, React.FC> = {
  shortcuts: Shortcuts,
  chat: Chat,
  notes: Notes,
  weather: Weather,
  system: System,
  mood: Mood,
};
