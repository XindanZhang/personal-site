"use client";

import { useEffect, useState } from "react";

interface CopyEmailButtonProps {
  email: string;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

export function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await copyText(email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      aria-label="Copy email address"
      className={`copy-inline-button ${copied ? "is-copied" : ""}`}
      onClick={handleCopy}
      type="button"
    >
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
