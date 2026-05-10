import { apiClient } from "@/lib/apiClient";

// Interfaces and Types
export interface PubSubWebhookPayload {
  message: {
    data: string; // base64 encoding of {"emailAddress": string, "historyId": string}
  };
}

// API Calls
export const triggerPubSubWebhook = async (data: PubSubWebhookPayload): Promise<string> => {
  // The doc says "Returns standard status 200 'OK' upon validation."
  // So it might return text or JSON. Our apiClient handles empty/text gracefully or throws if not OK.
  return apiClient<string>("/webhooks/gmail", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
