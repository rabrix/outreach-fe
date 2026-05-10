"use client";

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Users
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "./ui/Card";
import { cn } from "@/lib/utils";

/**
 * Variant 1: Metric Sparkline
 */
export function MetricSparklineCard({ 
  title, 
  period, 
  value, 
  trend, 
  isPositive 
}: { 
  title: string; 
  period: string; 
  value: string; 
  trend: string; 
  isPositive: boolean; 
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-xs text-muted-foreground">{period}</span>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <p className={cn(
            "flex items-center text-xs mt-1 font-medium",
            isPositive ? "text-emerald-500" : "text-destructive"
          )}>
            {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {trend}
          </p>
        </div>
        <div className="h-10 w-24">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <path
              d={isPositive ? "M0 35 L20 25 L40 30 L60 10 L80 15 L100 5" : "M0 5 L20 15 L40 10 L60 30 L80 25 L100 35"}
              fill="none"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Variant 2: Entity Performance
 */
export function EntityPerformanceCard({
  name,
  subtitle,
  avatar,
  value,
  trend,
  secondaryMetric,
  progress
}: {
  name: string;
  subtitle: string;
  avatar: string;
  value: string;
  trend: string;
  secondaryMetric: string;
  progress: number;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary overflow-hidden">
          {avatar ? <img src={avatar} alt={name} className="object-cover" /> : name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base truncate">{name}</CardTitle>
          <CardDescription className="truncate">{subtitle}</CardDescription>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">{value}</span>
            <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Performance</p>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-secondary" strokeWidth="4" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className="stroke-accent" 
                  strokeWidth="4" 
                  strokeDasharray={`${progress}, 100`} 
                  strokeLinecap="round" 
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                {progress}%
              </div>
            </div>
            <span className="text-sm font-semibold">{secondaryMetric}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Variant 3: Scheduled Event
 */
export function ScheduledEventCard({
  title,
  time,
  type,
  attendees
}: {
  title: string;
  time: string;
  type: 'lavender' | 'mint';
  attendees: string[];
}) {
  const bgClass = type === 'lavender' ? "bg-[#F5F3FF] dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30" : "bg-[#F0FDF4] dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30";
  const accentClass = type === 'lavender' ? "text-purple-600 dark:text-purple-400" : "text-emerald-600 dark:text-emerald-400";

  return (
    <Card className={cn(bgClass)}>
      <CardHeader>
        <div className={cn("flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1", accentClass)}>
          <Calendar size={14} />
          Scheduled Event
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Clock size={14} />
          {time}
        </div>
      </CardHeader>
      <CardFooter className="justify-between">
        <div className="flex -space-x-2 overflow-hidden">
          {attendees.map((url, i) => (
            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-secondary flex items-center justify-center text-[10px] font-bold overflow-hidden">
               <img src={url} alt={`Attendee ${i}`} className="h-full w-full object-cover" />
            </div>
          ))}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary ring-2 ring-background text-[10px] font-bold text-muted-foreground">
            +3
          </div>
        </div>
        <button className={cn("h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm hover:bg-secondary transition-colors", accentClass)}>
          <ChevronRight size={20} />
        </button>
      </CardFooter>
    </Card>
  );
}

/**
 * Variant 4: Integration Toggle
 */
export function IntegrationToggleCard({
  name,
  description,
  icon,
  isConnected
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="h-12 w-12 rounded-2xl border border-border flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <button className={cn(
          "px-4 py-1.5 rounded-lg text-sm font-bold transition-all border",
          isConnected 
            ? "bg-secondary border-border text-foreground" 
            : "bg-primary text-primary-foreground border-primary hover:opacity-90"
        )}>
          {isConnected ? "Connected" : "Connect"}
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1.5 mb-2">
          <CardTitle className="text-base">{name}</CardTitle>
          <CheckCircle2 size={16} className="text-blue-500 fill-blue-500 text-white" />
        </div>
        <CardDescription className="text-sm leading-relaxed line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <button className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
          View Integration Guide
          <ExternalLink size={12} />
        </button>
      </CardFooter>
    </Card>
  );
}
