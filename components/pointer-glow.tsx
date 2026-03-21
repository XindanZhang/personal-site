"use client";

import type { ComponentPropsWithoutRef, CSSProperties, ElementType, PointerEvent, ReactNode } from "react";

type PointerGlowProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "style">;

export function PointerGlow<T extends ElementType = "div">({
  as,
  children,
  className = "",
  style,
  ...rest
}: PointerGlowProps<T>) {
  const Tag = (as ?? "div") as ElementType;

  function updatePointer(event: PointerEvent<Element>) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  }

  return (
    <Tag
      {...rest}
      className={className}
      onPointerEnter={updatePointer}
      onPointerMove={updatePointer}
      style={style}
    >
      {children}
    </Tag>
  );
}
