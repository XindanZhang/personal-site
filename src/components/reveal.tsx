import type { CSSProperties, ElementType, ReactNode } from "react";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  "aria-labelledby"?: string;
}

export function Reveal({ as: Tag = "div", children, className = "", delay = 0, "aria-labelledby": ariaLabelledBy }: RevealProps) {
  return (
    <Tag className={`reveal ${className}`.trim()} aria-labelledby={ariaLabelledBy} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
