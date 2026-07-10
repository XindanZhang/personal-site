"use client";

import { Check, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="copy-link-button" onClick={handleClick} type="button" aria-live="polite">
      {copied ? <Check aria-hidden="true" size={15} /> : <Link2 aria-hidden="true" size={15} />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
