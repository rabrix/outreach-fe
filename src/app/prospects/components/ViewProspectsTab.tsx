"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { List, Trash2, Calendar, Users as UsersIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { LeadList } from "@/features/leads/calls";

const safeDate = (dateStr: any) => {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

interface ViewProspectsTabProps {
  isLoading: boolean;
  leadLists: LeadList[] | undefined;
  onDelete: (id: string) => void;
  onSwitchToAdd: () => void;
}

export function ViewProspectsTab({ isLoading, leadLists, onDelete, onSwitchToAdd }: ViewProspectsTabProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Fetching your lead lists...</p>
      </div>
    );
  }

  if (!leadLists || leadLists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-card/30 rounded-3xl border-2 border-dashed border-border/50">
        <div className="p-6 bg-secondary rounded-full">
          <List className="w-12 h-12 text-muted-foreground/50" />
        </div>
        <div>
          <h3 className="text-xl font-bold">No Lead Lists Found</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            Start by importing some leads to see them organized here.
          </p>
        </div>
        <button 
          onClick={onSwitchToAdd}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all"
        >
          Import Now
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leadLists.map((list) => (
        <Card key={list.id} className="group hover:shadow-2xl hover:border-primary/20 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <List className="w-6 h-6" />
              </div>
              <button 
                onClick={() => onDelete(list.id)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <CardTitle className="text-xl font-bold truncate mb-1">{list.name}</CardTitle>
              <div className="flex items-center text-xs text-muted-foreground gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(safeDate(list.createdAt), "MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <UsersIcon className="w-3 h-3" />
                  {list.leadCount || 0} Leads
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-6">
            <Link href={`/prospects/${list.id}`} className="w-full">
              <button className="w-full py-2.5 text-sm font-semibold border border-border rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                View Details
              </button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
