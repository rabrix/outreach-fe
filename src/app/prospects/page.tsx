"use client";
import React, { useState } from "react";

import { useAuthStore } from "@/store/useAuthStore";
import { useUploadLeads, useAllLeadLists, useDeleteLeadList } from "@/features/leads/hooks";
import { LeadData } from "@/features/leads/calls";
import { DashboardLayout } from "@/components";
import { toast } from "react-toastify";
import { PlusCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

// Sub-components
import { AddProspectsTab, ViewProspectsTab, LeadListModal } from "./components";

type TabType = "ADD" | "VIEW";

export default function ProspectsPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || (searchParams.get("listId") ? "VIEW" : "ADD");
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [jsonInput, setJsonInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [parsedLeads, setParsedLeads] = useState<LeadData[]>([]);

  const user = useAuthStore((state) => state.user);
  const uploadLeadsMutation = useUploadLeads();
  const { data: leadListsData, isLoading: isLoadingLists } = useAllLeadLists();
  const deleteListMutation = useDeleteLeadList();

  const extractName = (fullName: string) => {
    if (!fullName) return { firstName: "", lastName: "" };
    const cleanedName = fullName.split(/[-–—]/)[0].trim();
    const parts = cleanedName.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { firstName: "", lastName: "" };
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    return { firstName, lastName };
  };

  const handleInitialSubmit = () => {
    try {
      if (!jsonInput.trim()) {
        toast.error("Please enter some lead data");
        return;
      }
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        toast.error("Data must be an array of leads");
        return;
      }
      if (data.length === 0) {
        toast.error("No leads found in the input");
        return;
      }
      const processedLeads = data.map((lead: LeadData) => {
        if (lead.name && (!lead.firstName || !lead.lastName)) {
          const { firstName, lastName } = extractName(lead.name);
          return {
            ...lead,
            firstName: lead.firstName || firstName,
            lastName: lead.lastName || lastName,
          };
        }
        return lead;
      });
      const firstItem = processedLeads[0];
      if (!firstItem.email && !firstItem.name) {
        toast.warning("The data format might be incorrect. Please ensure each lead has at least a name or email.");
      }
      setParsedLeads(processedLeads);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Invalid JSON format. Please check your input.");
    }
  };

  const handleFinalUpload = async () => {
    if (!listName.trim()) {
      toast.error("Please enter a name for this lead list");
      return;
    }
    if (!user?.id) {
      toast.error("You must be logged in to upload leads");
      return;
    }
    uploadLeadsMutation.mutate(
      {
        leadListName: listName,
        userId: user.id,
        leads: parsedLeads,
      },
      {
        onSuccess: () => {
          toast.success("Leads uploaded successfully!");
          setIsModalOpen(false);
          setJsonInput("");
          setListName("");
          setParsedLeads([]);
          setActiveTab("VIEW");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to upload leads");
        },
      }
    );
  };

  const handleDeleteList = (id: string) => {
    if (confirm("Are you sure you want to delete this lead list? This will remove all leads within it.")) {
      deleteListMutation.mutate(id, {
        onSuccess: () => toast.success("Lead list deleted"),
        onError: (err: any) => toast.error(err.message || "Delete failed"),
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Prospects
            </h1>
            <p className="text-muted-foreground text-sm">
              {activeTab === "ADD" 
                ? "Import and process your lead data effortlessly." 
                : "Manage and view your existing lead lists."}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex p-1 bg-secondary/50 backdrop-blur-sm rounded-2xl border border-border/50 w-fit">
            <TabButton 
              active={activeTab === "ADD"} 
              onClick={() => setActiveTab("ADD")}
              icon={<PlusCircle className="w-4 h-4" />}
              label="Add Prospects"
            />
            <TabButton 
              active={activeTab === "VIEW"} 
              onClick={() => setActiveTab("VIEW")}
              icon={<Eye className="w-4 h-4" />}
              label="View"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="relative min-h-[500px]">
          {activeTab === "ADD" ? (
            <AddProspectsTab 
              jsonInput={jsonInput} 
              setJsonInput={setJsonInput} 
              onProcess={handleInitialSubmit} 
            />
          ) : (
            <ViewProspectsTab 
              isLoading={isLoadingLists} 
              leadLists={leadListsData?.leadLists} 
              onDelete={handleDeleteList}
              onSwitchToAdd={() => setActiveTab("ADD")}
            />
          )}
        </div>

        {/* Modals */}
        <LeadListModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          listName={listName}
          setListName={setListName}
          onSave={handleFinalUpload}
          isUploading={uploadLeadsMutation.isPending}
          leadCount={parsedLeads.length}
        />
      </div>
    </DashboardLayout>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
        active 
          ? "bg-background text-primary shadow-sm" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
