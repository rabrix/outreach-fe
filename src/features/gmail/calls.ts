import { apiClient } from "@/lib/apiClient";

export interface GmailAccount {
  id: string;
  userId: string;
  emailAddress: string;
  isActive: boolean;
  tokenExpiry?: string;
  lastHistoryId?: string;
  watchExpiration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllAccountsResponse {
  success: true;
  accounts: GmailAccount[];
}

export const getAllGmailAccounts = async (userId: string): Promise<GetAllAccountsResponse> => {
  return apiClient<GetAllAccountsResponse>(`/gmail/accounts/${userId}`, {
    method: "GET",
  });
};

// Email Templates
export interface EmailTemplate {
  id: string;
  subject: string;
  body: string;
  step: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  subject: string;
  body: string;
  step: number;
}

export interface CreateTemplateResponse {
  success: true;
  template: EmailTemplate;
}

export interface GetAllTemplatesResponse {
  success: true;
  templates: EmailTemplate[];
}

export const createTemplate = async (data: CreateTemplateRequest): Promise<CreateTemplateResponse> => {
  return apiClient<CreateTemplateResponse>("/gmail/templates", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTemplate = async (
  id: string,
  data: Partial<CreateTemplateRequest>
): Promise<CreateTemplateResponse> => {
  return apiClient<CreateTemplateResponse>(`/gmail/templates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteTemplate = async (id: string): Promise<{ success: true; message: string }> => {
  return apiClient<{ success: true; message: string }>(`/gmail/templates/${id}`, {
    method: "DELETE",
  });
};

export const getAllTemplates = async (): Promise<GetAllTemplatesResponse> => {
  return apiClient<GetAllTemplatesResponse>("/gmail/templates", {
    method: "GET",
  });
};

export const getAuthUrl = (userId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  return `${baseUrl}/gmail/auth?userId=${userId}`;
};
