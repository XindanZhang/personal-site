import type { CSSProperties, ElementType, ReactNode } from "react";

interface PromptSectionProps {
  command: string;
  children: ReactNode;
  as?: ElementType;
  caret?: boolean;
  className?: string;
  cwd?: string;
  typed?: boolean;
  typeDelayMs?: number;
  typeDurationMs?: number;
  userHost?: string;
}

export function PromptSection({
  command,
  children,
  as: Tag = "section",
  caret = false,
  className = "",
  cwd = "~",
  typed = false,
  typeDelayMs = 0,
  typeDurationMs = 640,
  userHost = "xindan@toronto-node",
}: PromptSectionProps) {
  const promptPath = `:${cwd}$`;
  const sectionClassName = typed
    ? className
      ? `prompt-section is-typed ${className}`
      : "prompt-section is-typed"
    : className
      ? `prompt-section ${className}`
      : "prompt-section";
  const promptLineClassName = typed ? "prompt-line is-typed" : "prompt-line";
  const typingStyle = typed
    ? ({
        "--type-delay": `${typeDelayMs}ms`,
        "--type-duration": `${typeDurationMs}ms`,
        "--type-steps": command.length,
        "--type-ch": command.length,
      } as CSSProperties)
    : undefined;

  return (
    <Tag className={sectionClassName} style={typingStyle}>
      <div className={promptLineClassName}>
        <span className="prompt-userhost">{userHost}</span>
        <span className="prompt-path">{promptPath}</span>
        {typed ? (
          <span className="prompt-command-clip">
            <span className="prompt-command prompt-command-typing">{command}</span>
          </span>
        ) : (
          <span className="prompt-command">{command}</span>
        )}
        {caret ? <span aria-hidden="true" className="terminal-caret" /> : null}
      </div>
      <div className="terminal-output">{children}</div>
    </Tag>
  );
}
