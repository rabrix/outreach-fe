import { apiClient } from "@/lib/apiClient";

/** GET /api/v1/threads and GET /api/v1/threads/replies/since */
export type EmailThreadSummary = {
  id: string;
  gmailThreadId: string;
  gmailAccountId: string;
  participantEmail: string;
  lastMessageAt: string;
  lastMessageSnippet?: string | null;
  unreadCount: number;
  createdAt: string;
};

export type ListThreadsResponse = EmailThreadSummary[];

/** GET /api/v1/threads/:id */
export type FullThreadMessage = {
  id: string;
  gmailMessageId: string;
  direction: "outbound" | "inbound";
  fromEmail?: string;
  toEmail?: string;
  subject: string;
  sentAt?: string;
  body: string;
};

export type FullThreadResponse = {
  id: string;
  gmailThreadId: string;
  gmailAccountId: string;
  participantEmail: string;
  messages: FullThreadMessage[];
};

export interface SendReplyRequest {
  accountId: string;
  threadId: string;
  body: string;
}

export const listThreads = async (): Promise<ListThreadsResponse> => {
  return apiClient<ListThreadsResponse>("/threads", {
    method: "GET",
  });
};

export const listThreadsWithRepliesSince = async (
  afterIso: string
): Promise<ListThreadsResponse> => {
  const params = new URLSearchParams({ after: afterIso });
  return apiClient<ListThreadsResponse>(`/threads/replies/since?${params.toString()}`, {
    method: "GET",
  });
};

export const getThreadDetails = async (id: string): Promise<FullThreadResponse> => {
  return apiClient<FullThreadResponse>(`/threads/${id}`, {
    method: "GET",
  });
};

export const sendReply = async (
  data: SendReplyRequest
): Promise<{ success: true; message: string }> => {
  return apiClient<{ success: true; message: string }>("/gmail/reply", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
