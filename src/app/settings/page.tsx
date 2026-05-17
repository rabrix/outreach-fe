"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGmailAccounts, useDeleteGmailAccount } from "@/features/gmail/hooks";
import { getAuthUrl } from "@/features/gmail/calls";
import { DashboardLayout } from "@/components";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import {
  Settings as SettingsIcon,
  Mail,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const { data, isLoading, refetch, isRefetching } = useGmailAccounts(user?.id || "");
  const deleteAccount = useDeleteGmailAccount(user?.id || "");

  // Handle callback success/error from URL params
  useEffect(() => {
    const gmailConnected = searchParams.get("gmail_connected");
    const error = searchParams.get("error");

    if (gmailConnected === "true") {
      toast.success("Gmail account connected successfully!");
      refetch();
      // Clean up URL
      window.history.replaceState({}, "", "/settings");
    } else if (error) {
      const errorMessages: Record<string, string> = {
        missing_params: "Authentication failed: Missing parameters from Google.",
        insufficient_scopes: "Please grant all required permissions to continue.",
        email_already_in_use: "This Gmail account is already connected to another user.",
        failed_tokens: "Failed to retrieve authentication tokens from Google.",
        server_error: "An internal server error occurred during authentication.",
        no_email: "Could not retrieve email address from your Google profile.",
      };

      toast.error(errorMessages[error] || `Authentication failed: ${error}`);
      window.history.replaceState({}, "", "/settings");
    }
  }, [searchParams, refetch]);

  const handleConnect = () => {
    if (!user?.id) {
      toast.error("User session not found. Please log in again.");
      return;
    }
    // Redirect to backend OAuth flow
    window.location.href = getAuthUrl(user.id);
  };

  const handleDeleteAccount = async (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete the account ${email}?`)) {
      try {
        await deleteAccount.mutateAsync(id);
        toast.success("Account deleted successfully");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing accounts...");
  };

  return (
    <DashboardLayout>
      <div className="mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your account configurations and integrations.</p>
        </div>

        {/* Gmail Integration Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Integrations</h2>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Connect Card */}
            <Card className="border-dashed bg-secondary/30 hover:bg-secondary/50 transition-all border-2">
              <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-border/50 flex items-center justify-center p-2.5 flex-shrink-0">
                    <img
                      src="https://www.gstatic.com/images/branding/product/2x/googleg_96dp.png"
                      alt="Google"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 text-left">
                    <h3 className="font-bold text-xl">Connect Gmail</h3>
                    <p className="text-sm text-muted-foreground">
                      Link your Gmail account to start sending automated outreach campaigns.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleConnect}
                  className="whitespace-nowrap px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Connect Account
                </button>
              </div>
            </Card>

            {/* Connected Accounts List */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between ml-1">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Connected Accounts ({data?.accounts?.length || 0})
                </h4>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading || isRefetching}
                  className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", (isLoading || isRefetching) && "animate-spin")} />
                  Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 bg-card rounded-3xl border border-border/50">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">Fetching accounts...</p>
                </div>
              ) : data?.accounts && data.accounts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {data.accounts.map((account) => (
                    <Card key={account.id} className="group hover:shadow-lg transition-all border-border/50">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-inner",
                            account.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>
                            {account.emailAddress[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{account.emailAddress}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!account.isActive && (
                            <button
                              onClick={handleConnect}
                              className="p-2.5 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl transition-all group/btn flex items-center gap-2 px-4 text-xs font-bold shadow-sm"
                            >
                              <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                              Reconnect
                            </button>
                          )}
                          {account.isActive && (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3" />
                                Active
                              </div>
                            </div>
                          )}
                          <button
                            onClick={() => handleDeleteAccount(account.id, account.emailAddress)}
                            disabled={deleteAccount.isPending}
                            className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                            title="Delete Account"
                          >
                            {deleteAccount.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-card/30 rounded-3xl border-2 border-dashed border-border/50 text-center space-y-4">
                  <div className="p-4 bg-secondary rounded-full">
                    <Mail className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h5 className="font-bold">No Gmail accounts connected</h5>
                    <p className="text-sm text-muted-foreground">Connect your first account to start sending emails.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
