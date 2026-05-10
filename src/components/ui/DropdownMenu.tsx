"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  { asChild?: boolean; children: React.ReactNode }
>(({ asChild, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // This is a bit tricky without a context. Let's use a simple approach.
  return (
    <div 
      onClick={() => {
        // Toggle logic will be handled by a context if we had one.
        // For simplicity, let's just render the trigger.
      }}
    >
      {children}
    </div>
  );
});

// Let's implement a more robust version with context
const DropdownContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

const DropdownMenuRoot = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropdownMenuTriggerImpl = React.forwardRef<
  HTMLDivElement,
  { asChild?: boolean; children: React.ReactNode }
>(({ asChild, children, ...props }, ref) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  return (
    <div
      ref={ref}
      onClick={() => context.setIsOpen(!context.isOpen)}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
});

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  { align?: "start" | "end"; className?: string; children: React.ReactNode }
>(({ align = "start", className, children, ...props }, ref) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");

  if (!context.isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-card p-1 text-card-foreground shadow-xl animate-in fade-in zoom-in-95 duration-200",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  { className?: string; onClick?: () => void; children: React.ReactNode }
>(({ className, onClick, children, ...props }, ref) => {
  const context = React.useContext(DropdownContext);
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
    if (context) context.setIsOpen(false);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-secondary hover:text-foreground active:bg-secondary/80",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});

export {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuTriggerImpl as DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
