"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";

interface AddProspectsTabProps {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  onProcess: () => void;
}

export function AddProspectsTab({ jsonInput, setJsonInput, onProcess }: AddProspectsTabProps) {
  return (
    <div className="animate-in slide-in-from-left-4 duration-500">
      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm border border-border/50 overflow-hidden">
        <CardContent className="pt-8">
          <div className="relative group">
            <textarea
              className="w-full h-[400px] p-6 font-mono text-sm bg-background/50 border-2 border-border rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
              placeholder='[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "agency": "Real Estate Co",
    ...
  }
]'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-3 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                JSON Input
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 pt-2 pb-8 px-8">
          <button
            onClick={() => setJsonInput("")}
            className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
          >
            Clear
          </button>
          <button
            onClick={onProcess}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2"
          >
            <span>Process Leads</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
