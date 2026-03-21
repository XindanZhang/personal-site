"use client";

import { useEffect } from "react";

const shortcutKeys = new Set(["F1", "F2", "F3", "F4"]);
const blockedTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function ShellShortcuts() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !shortcutKeys.has(event.key)
      ) {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && (blockedTags.has(activeElement.tagName) || activeElement.isContentEditable)) {
        return;
      }

      const shortcutTarget = document.querySelector<HTMLAnchorElement>(`[data-shell-shortcut="${event.key}"]`);
      if (!shortcutTarget) {
        return;
      }

      event.preventDefault();
      shortcutTarget.click();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
