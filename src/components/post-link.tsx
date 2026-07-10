import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function PostLink({ slug, className, children }: { slug: string; className?: string; children: ReactNode }) {
  return (
    <Link className={className} to="/blog/$/" params={{ _splat: slug }}>
      {children}
    </Link>
  );
}
