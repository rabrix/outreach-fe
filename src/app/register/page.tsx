"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/features/auth/hooks";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  
  const registerMutation = useRegister();
  const setAuth = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName) {
      toast.error("Please fill in all required fields");
      return;
    }

    registerMutation.mutate(
      formData,
      {
        onSuccess: (data) => {
          setAuth(data.user as any, data.token);
          toast.success("Account created successfully!");
          router.push("/");
        },
        onError: (error: any) => {
          toast.error(error.message || "Registration failed. Please try again.");
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse transition-all duration-1000" />

      <div className="w-full max-w-xl px-4 relative z-10 animate-in fade-in zoom-in-95 duration-500 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4 text-primary-foreground font-bold text-3xl">
            O
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Outreach and start automating your campaigns</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    name="firstName"
                    type="text"
                    placeholder="John"
                    className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground ml-1">
                  Must be at least 8 characters long and include special characters.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="px-8 py-6 bg-muted/30 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
