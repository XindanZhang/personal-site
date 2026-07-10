"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function handleToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      className="icon-button theme-button"
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Use ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <Sun className="theme-icon theme-icon-sun" aria-hidden="true" size={18} strokeWidth={1.8} />
      <Moon className="theme-icon theme-icon-moon" aria-hidden="true" size={18} strokeWidth={1.8} />
    </button>
  );
}
