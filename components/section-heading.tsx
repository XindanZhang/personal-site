import type { ElementType } from "react";

interface SectionHeadingProps {
  title: string;
  as?: ElementType;
  eyebrow?: string;
}

export function SectionHeading({
  title,
  as: Tag = "h2",
  eyebrow,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <Tag className="section-title">{title}</Tag>
      <div className="section-rule" />
    </div>
  );
}
