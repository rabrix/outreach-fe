"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Menu, Bell, Search, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useThreads } from "@/features/threads/hooks";
import { useAuthStore } from "@/store/useAuthStore";


interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onMobileMenuToggle: () => void;
  showSupport?: boolean;
}

export function Header({
  sidebarOpen,
  onToggleSidebar,
  onMobileMenuToggle,
  showSupport = true,
}: HeaderProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: threadsData } = useThreads({ enabled: isAuthenticated });
  const unreadTotal = useMemo(() => {
    const threads = Array.isArray(threadsData) ? threadsData : [];
    return threads.reduce((sum, t) => sum + (t.unreadCount ?? 0), 0);
  }, [threadsData]);

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu size={20} />
        </button>
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center bg-secondary/50 border border-border rounded-lg px-3 py-1.5 w-64 md:w-80 group focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search size={16} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search campaigns, prospects..."
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-muted-foreground/70 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        {showSupport && (

          <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground hidden xs:flex" title="Help & Support">
            <HelpCircle size={20} />
          </button>
        )}
        <Link
          href="/outbox"
          className={cn(
            "p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground relative inline-flex",
            unreadTotal > 0 && "text-foreground"
          )}
          title={unreadTotal > 0 ? `${unreadTotal} unread in inbox` : "Inbox"}
          aria-label={unreadTotal > 0 ? `${unreadTotal} unread conversations` : "Open inbox"}
        >
          <Bell size={20} />
          {unreadTotal > 0 ? (
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground border-2 border-background leading-none"
              aria-hidden
            >
              {unreadTotal > 99 ? "99+" : unreadTotal}
            </span>
          ) : null}
        </Link>
        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity hidden sm:block">
          New Campaign
        </button>
      </div>
    </header>
  );
}
