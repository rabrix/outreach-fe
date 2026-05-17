"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "@/components/ui/Modal";
import type { LeadList } from "@/features/leads/calls";
import type { GmailAccount } from "@/features/gmail/calls";
import type { CreateCampaignRequest } from "@/features/campaigns/calls";

type CreateCampaignModalProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  leadLists: LeadList[];
  gmailAccounts: GmailAccount[];
  isSubmitting: boolean;
  onSubmit: (payload: CreateCampaignRequest) => void;
};

export function CreateCampaignModal({
  open,
  onClose,
  userId,
  leadLists,
  gmailAccounts,
  isSubmitting,
  onSubmit,
}: CreateCampaignModalProps) {
  const [name, setName] = useState("");
  const [leadListId, setLeadListId] = useState("");
  const [gmailAccountIds, setGmailAccountIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setName("");
      setLeadListId("");
      setGmailAccountIds([]);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const toggleGmail = (id: string) => {
    setGmailAccountIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }
    if (!leadListId) {
      toast.error("Please select a lead list");
      return;
    }
    if (gmailAccountIds.length === 0) {
      toast.error("Please select at least one Gmail account");
      return;
    }
    if (!userId) {
      toast.error("You must be signed in");
      return;
    }
    onSubmit({
      name: name.trim(),
      leadListId,
      gmailAccountIds,
      userId,
    });
  };

  return (
    <Modal isOpen={open} onClose={handleClose} title="Create New Campaign">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold">Campaign Name</label>
          <input
            type="text"
            placeholder="e.g., Summer Outreach 2024"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Select Lead List</label>
          <select
            value={leadListId}
            onChange={(e) => setLeadListId(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
          >
            <option value="">Choose a list...</option>
            {leadLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name} ({list.leadsCount ?? list.leadCount ?? 0} leads)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Select Gmail Accounts</label>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {gmailAccounts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 italic">
                No Gmail accounts connected. Go to settings to connect one.
              </p>
            ) : (
              gmailAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => toggleGmail(account.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                    gmailAccountIds.includes(account.id)
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">{account.emailAddress}</span>
                  </div>
                  {gmailAccountIds.includes(account.id) ? <CheckCircle2 className="w-4 h-4" /> : null}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
