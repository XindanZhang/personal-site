"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  "aria-labelledby"?: string;
}

export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  "aria-labelledby": ariaLabelledBy,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      aria-labelledby={ariaLabelledBy}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
