import { apiClient } from "@/lib/apiClient";

// Interfaces and Types
export interface LeadData {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  agency?: string;
  isTeam?: boolean;
  leadInfo?: string;
  rating?: number;
  reviewsText?: string;
  salesLast12Months?: string;
  totalSales?: string;
  priceRange?: string;
  averagePrice?: string;
  yearsOfExperience?: string;
  phone?: string;
  address?: string;
}

export type LeadStatus = "pending" | "contacted" | "replied" | "noreply" | "bounced" | "stopped";

export interface Lead extends LeadData {
  id: string;
  leadListId: string;
  status: LeadStatus;
  currentStep: number;
  lastContactedAt?: string;
  nextStepAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadList {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  leadCount?: number;
}

export interface UploadLeadsRequest {
  leadListName: string;
  userId: string;
  leads: LeadData[];
}

export interface UploadLeadsResponse {
  success: true;
  message: string;
  leadListId: string;
}

export interface DeleteLeadResponse {
  success: true;
  message: string;
  leadId: string;
}

export interface DeleteLeadListResponse {
  success: true;
  message: string;
  leadListId: string;
}

export interface GetLeadListResponse {
  success: true;
  leadList: LeadList;
  leads: Lead[];
}

export interface GetAllLeadListsResponse {
  success: true;
  leadLists: LeadList[];
}

export interface GetLeadsByLeadListResponse {
  success: true;
  leads: Lead[];
}

// API Calls
export const uploadLeads = async (data: UploadLeadsRequest): Promise<UploadLeadsResponse> => {
  return apiClient<UploadLeadsResponse>("/leads/upload", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteLead = async (leadId: string): Promise<DeleteLeadResponse> => {
  return apiClient<DeleteLeadResponse>(`/leads/${leadId}`, {
    method: "DELETE",
  });
};

export const deleteLeadList = async (leadListId: string): Promise<DeleteLeadListResponse> => {
  return apiClient<DeleteLeadListResponse>(`/leads/list/${leadListId}`, {
    method: "DELETE",
  });
};

export const getLeadList = async (leadListId: string): Promise<GetLeadListResponse> => {
  return apiClient<GetLeadListResponse>(`/leads/list/${leadListId}`, {
    method: "GET",
  });
};

export const getAllLeadLists = async (): Promise<GetAllLeadListsResponse> => {
  return apiClient<GetAllLeadListsResponse>("/leads/lists", {
    method: "GET",
  });
};

export const getLeadsByLeadList = async (leadListId: string): Promise<GetLeadsByLeadListResponse> => {
  return apiClient<GetLeadsByLeadListResponse>(`/leads/${leadListId}`, {
    method: "GET",
  });
};
