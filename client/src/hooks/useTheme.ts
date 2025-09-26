// hooks/useTheme.ts
import { useEffect, useState } from "react";

export function useTheme(
  setChangeCanvasColor: (tool: string) => void,
  changeCanvasColor: string
) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const { theme } = JSON.parse(savedTheme);
      return theme === "dark" ? "dark" : "light"; // fallback
    }
    return "light"; // default
  });
 
  // On mount → apply saved theme & canvas color
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const { theme, canvas } = JSON.parse(savedTheme);

      const normalized = /^#([0-9a-f]{8})$/i.test(canvas) ? "#" + canvas.slice(1, 7) : canvas
      
      setTheme(theme);
      setChangeCanvasColor(normalized);
      document.body.classList.remove("light", "dark-mode");
      document.body.classList.add(theme === "dark" ? "dark-mode" : "light");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("light");
        document.body.classList.add("dark-mode");
      }
    }
  }, []);

  // Persist theme + canvas color
  useEffect(() => {
    localStorage.setItem(
      "theme",
      JSON.stringify({ theme, canvas: changeCanvasColor })
    );

    // update body class when theme changes
    document.body.classList.remove("light", "dark-mode");
    document.body.classList.add(theme === "dark" ? "dark-mode" : "light");
  }, [theme, changeCanvasColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
