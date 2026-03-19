"use client";

import { useState } from "react";

export function CopyLinkButton() {
  const [label, setLabel] = useState("Copy Link");

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLabel("Copied");
    } catch {
      setLabel("Copy failed");
    }

    window.setTimeout(() => setLabel("Copy Link"), 1200);
  }

  return (
    <button className="button-link is-secondary" onClick={handleClick} type="button">
      {label}
    </button>
  );
}
