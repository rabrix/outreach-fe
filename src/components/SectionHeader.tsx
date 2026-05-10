"use client";

import React from "react";

type SectionHeaderProps = {
  title: string;
  action?: { label: string; onClick: () => void };
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="text-sm font-semibold text-primary hover:underline shrink-0"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
