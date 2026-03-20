import type { ElementType, ReactNode } from "react";

interface PromptSectionProps {
  command: string;
  children: ReactNode;
  as?: ElementType;
  caret?: boolean;
  className?: string;
  host?: string;
}

export function PromptSection({
  command,
  children,
  as: Tag = "section",
  caret = false,
  className = "",
  host = "xz@toronto-node",
}: PromptSectionProps) {
  const sectionClassName = className ? `prompt-section ${className}` : "prompt-section";

  return (
    <Tag className={sectionClassName}>
      <div className="prompt-line">
        <span className="prompt-prefix">{host}</span>
        <span className="prompt-command">{command}</span>
        {caret ? <span aria-hidden="true" className="terminal-caret" /> : null}
      </div>
      <div className="terminal-output">{children}</div>
    </Tag>
  );
}
