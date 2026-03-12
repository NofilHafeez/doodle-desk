import { useEffect } from "react";

export const useHistoryShortcuts = (undo: () => void, redo: () => void) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
  const ctrlOrCmd = e.ctrlKey || e.metaKey;

  if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    redo();
  } 
  else if (ctrlOrCmd && e.key.toLowerCase() === "z") {
    e.preventDefault();
    undo();
  }
};
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [undo, redo]);
};
