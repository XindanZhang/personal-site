import type { ElementType } from "react";

interface SectionHeadingProps {
  title: string;
  as?: ElementType;
}

export function SectionHeading({ title, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      <Tag className="font-mono text-lg font-bold">{title}</Tag>
      <hr className="mt-2 border-t border-dotted border-gray-400" />
    </div>
  );
}
