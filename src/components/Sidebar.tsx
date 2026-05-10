"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mail,
  FileText,
  Users,
  Send,
  Settings,
  LogOut,
  PanelLeftClose,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, href, active = false, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md transition cursor-pointer",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="text-sm flex-1">{label}</span>
    </Link>
  );
}

interface SidebarProps {
  isOpen: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isOpen, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Mail, label: "Campaigns", href: "/campaigns" },
    { icon: Users, label: "Prospects", href: "/prospects" },
    { icon: FileText, label: "Templates", href: "/templates" },
    { icon: Send, label: "Outbox", href: "/outbox" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-full bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden transition-all duration-300 md:relative md:translate-x-0",
        isOpen ? "md:w-64" : "md:w-0 md:border-none",
        isMobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full w-64"
      )}
    >
      {/* Logo */}
      <div className="px-6 py-4 border-b border-sidebar-border h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            O
          </div>
          <span className="text-lg font-bold text-foreground">Outreach</span>
        </Link>
        <button onClick={onMobileClose} className="md:hidden text-muted-foreground">
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
            onClick={onMobileClose}
          />
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-4">
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-all font-semibold text-sm disabled:opacity-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
