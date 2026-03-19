"use client";

import { useState } from "react";

const buttonClassName = `
  flex cursor-pointer items-center gap-2 border border-black bg-white px-3 py-1
  font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
  transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px]
  hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]
`;

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
    <button className={buttonClassName} onClick={handleClick} type="button">
      {label}
    </button>
  );
}
