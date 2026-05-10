"use client";

import React from "react";
import { Card, CardContent } from "./ui/Card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  change,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("hover:shadow-xl hover:-translate-y-1 group", className)}>
      <div className="flex items-start justify-between">
        <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          {icon}
        </div>
        {change && (
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {title}
        </p>
        <h2 className="text-2xl font-bold text-foreground mt-0.5">
          {value}
        </h2>
      </div>
    </Card>
  );
}
