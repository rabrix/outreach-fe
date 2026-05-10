"use client";

import React, { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useThreadReplyPoll } from "@/features/threads/hooks";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSupport?: boolean;
}

export function DashboardLayout({
  children,
  showSupport = true,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useThreadReplyPoll(isAuthenticated);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          showSupport={showSupport}
        />

        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
