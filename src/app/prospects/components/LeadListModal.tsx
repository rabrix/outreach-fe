"use client";

import React from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";

interface LeadListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listName: string;
  setListName: (val: string) => void;
  onSave: () => void;
  isUploading: boolean;
  leadCount: number;
}

export function LeadListModal({ 
  isOpen, 
  onClose, 
  listName, 
  setListName, 
  onSave, 
  isUploading,
  leadCount
}: LeadListModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="p-4 bg-primary/10 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Name Your Lead List</h3>
              <p className="text-muted-foreground mt-1">
                Give this collection of {leadCount} leads a descriptive name.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="listName" className="text-sm font-medium ml-1">
                List Name
              </label>
              <input
                id="listName"
                type="text"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g., Indiana Real Estate Agents - May 2024"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={onSave}
                disabled={isUploading}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Save List</span>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
