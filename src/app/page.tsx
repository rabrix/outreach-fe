"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  DashboardLayout,
  Card,
  MetricSparklineCard,
  EntityPerformanceCard,
  ScheduledEventCard,
  IntegrationToggleCard
} from "@/components";


import { useAuthStore } from "@/store/useAuthStore";


export default function HomePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Stats data adapted for MetricSparklineCard
  const stats = [
    {
      title: "Active Campaigns",
      value: "12",
      period: "This week",
      trend: "+2",
      isPositive: true,
    },
    {
      title: "Total Prospects",
      value: "2,450",
      period: "This month",
      trend: "+180",
      isPositive: true,
    },
    {
      title: "Emails Sent",
      value: "15.2k",
      period: "Today",
      trend: "+1.2k",
      isPositive: true,
    },
    {
      title: "Average Reply Rate",
      value: "2.5%",
      period: "Last week",
      trend: "+1.2%",
      isPositive: true,
    },
  ];


  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <MetricSparklineCard
              key={i}
              title={stat.title}
              value={stat.value}
              period={stat.period}
              trend={stat.trend}
              isPositive={stat.isPositive}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Recent Campaigns</h2>
            <button className="text-sm font-semibold text-primary hover:underline">
              View All
            </button>
          </div>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-4 hover:bg-secondary/50 transition cursor-pointer flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                    C{item}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">
                      SaaS Founders Q2 Outreach #{item}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      Active • 450 prospects • 24% reply rate
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-foreground">124 sent</p>
                    <p className="text-xs text-muted-foreground">Last sent 2h ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>

  );
}
