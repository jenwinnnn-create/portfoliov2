import { useState, useEffect, useCallback } from "react";

/* Reads the theme set by the inline script in index.html,
   toggles the `.dark` class on <html>, and persists to localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* private mode — ignore */
    }
    // let canvas/background components re-read theme CSS vars
    window.dispatchEvent(new Event("portfolio-theme"));
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return [theme, toggle];
}
