"use client";

import { cn } from "@/lib/utils";

const sizeClass = {
  sm: "h-8 w-8 border-2",
  md: "h-10 w-10 border-2",
  lg: "h-12 w-12 border-2",
} as const;

export type SpinnerSize = keyof typeof sizeClass;

export function Spinner({
  size = "md",
  className,
}: {
  size?: SpinnerSize;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-primary/30 border-t-primary",
        sizeClass[size],
        className
      )}
    />
  );
}
