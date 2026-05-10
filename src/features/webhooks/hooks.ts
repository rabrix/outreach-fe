import { useMutation } from "@tanstack/react-query";
import { triggerPubSubWebhook, PubSubWebhookPayload } from "./calls";

export const useTriggerPubSubWebhook = () => {
  return useMutation({
    mutationFn: (data: PubSubWebhookPayload) => triggerPubSubWebhook(data),
  });
};
