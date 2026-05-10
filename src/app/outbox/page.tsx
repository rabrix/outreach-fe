"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components";
import { useThreads, useThreadDetails, useSendReply } from "@/features/threads/hooks";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Send,
  Mail,
  Inbox,
  Search,
  ArrowLeft,
  Loader2,
  CornerUpLeft,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

const safeDate = (dateStr: any) => {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

export default function OutboxPage() {
  const { data: threadsData, isLoading: isLoadingThreads } = useThreads();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const threads = Array.isArray(threadsData) ? threadsData : [];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
        {/* Thread List */}
        <div className={cn(
          "w-full md:w-80 flex flex-col gap-4 transition-all duration-300",
          selectedThreadId ? "hidden md:flex" : "flex"
        )}>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Outbox</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {isLoadingThreads ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
                <Inbox className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={cn(
                    "p-4 rounded-2xl cursor-pointer transition-all border border-transparent",
                    selectedThreadId === thread.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-card hover:bg-secondary hover:border-border"
                  )}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <p className={cn(
                      "font-bold text-sm truncate flex-1 min-w-0",
                      selectedThreadId === thread.id ? "text-white" : "text-foreground"
                    )}>
                      {thread.participantEmail}
                    </p>
                    <span className={cn(
                      "text-[10px] shrink-0",
                      selectedThreadId === thread.id ? "text-white/70" : "text-muted-foreground"
                    )}>
                      {format(safeDate(thread.lastMessageAt), "h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(thread.unreadCount ?? 0) > 0 && selectedThreadId !== thread.id ? (
                      <span
                        className={cn(
                          "shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center",
                          "bg-accent text-accent-foreground"
                        )}
                        aria-label={`${thread.unreadCount} unread`}
                      >
                        {(thread.unreadCount ?? 0) > 99 ? "99+" : thread.unreadCount}
                      </span>
                    ) : null}
                    <p className={cn(
                      "text-xs line-clamp-1 flex-1 min-w-0",
                      selectedThreadId === thread.id ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {thread.lastMessageSnippet ?? "No preview"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversation View */}
        <div className={cn(
          "flex-1 flex flex-col gap-4",
          !selectedThreadId ? "hidden md:flex items-center justify-center bg-card/30 rounded-3xl border border-dashed border-border" : "flex"
        )}>
          {selectedThreadId ? (
            <ThreadDetailView 
              threadId={selectedThreadId} 
              onBack={() => setSelectedThreadId(null)} 
            />
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                <Mail className="w-8 h-8" />
              </div>
              <p className="text-muted-foreground font-medium">Select a conversation to view details</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ThreadDetailView({ threadId, onBack }: { threadId: string, onBack: () => void }) {
  const { data: thread, isLoading } = useThreadDetails(threadId);
  const sendReplyMutation = useSendReply();
  const [replyBody, setReplyBody] = useState("");

  const handleSend = () => {
    if (!replyBody.trim()) return;
    if (!thread) return;

    sendReplyMutation.mutate({
      accountId: thread.gmailAccountId,
      threadId: thread.gmailThreadId,
      body: replyBody,
    }, {
      onSuccess: () => {
        toast.success("Reply sent");
        setReplyBody("");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to send reply");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-card rounded-3xl border border-border overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-4 bg-gray-50/50">
        <button onClick={onBack} className="md:hidden p-2 hover:bg-secondary rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
          {thread?.participantEmail?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate">{thread?.participantEmail}</h3>
          <p className="text-xs text-muted-foreground">Gmail Conversation</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {thread?.messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex flex-col max-w-[80%]",
            msg.direction === "outbound" ? "ml-auto items-end" : "mr-auto items-start"
          )}>
            <div className={cn(
              "p-4 rounded-2xl text-sm shadow-sm",
              msg.direction === "outbound" 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-secondary text-foreground rounded-tl-none"
            )}>
              <div 
                className={cn(
                  "message-body max-w-none break-words",
                  msg.direction === "outbound" ? "text-primary-foreground" : "text-foreground"
                )}
                dangerouslySetInnerHTML={{ __html: msg.body }} 
              />
              <p className="mt-2 text-[10px] opacity-70">
                {msg.sentAt
                  ? format(safeDate(msg.sentAt), "MMM d, h:mm a")
                  : "—"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t border-border bg-gray-50/50">
        <div className="relative group">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Type your reply here..."
            className="w-full bg-background border border-border rounded-2xl p-4 pr-16 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none min-h-[100px]"
          />
          <button
            onClick={handleSend}
            disabled={sendReplyMutation.isPending || !replyBody.trim()}
            className="absolute right-3 bottom-3 p-3 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.1] active:scale-[0.9] transition-all disabled:opacity-50"
          >
            {sendReplyMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground px-2">
          <CornerUpLeft className="w-3 h-3" />
          <span>Reply will be sent as plaintext</span>
        </div>
      </div>
    </div>
  );
}
