"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (useAuthStore.getState().isLoggingOut) return;

      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        toast.error("Session expired, please login again.");
        router.push("/login");
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    const token = localStorage.getItem("token");
    const publicPaths = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ];
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    if (!token && !isPublicPath) {
      router.push("/login");
    } else if (token && isPublicPath) {
      router.push("/");
    } else {
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
