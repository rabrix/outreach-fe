import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getAllGmailAccounts, 
  getAllTemplates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  CreateTemplateRequest 
} from "./calls";

export const gmailKeys = {
  accounts: (userId: string) => ["gmail", "accounts", userId] as const,
  templates: ["gmail", "templates"] as const,
};

export const useGmailAccounts = (userId: string) => {
  return useQuery({
    queryKey: gmailKeys.accounts(userId),
    queryFn: () => getAllGmailAccounts(userId),
    enabled: !!userId,
  });
};

export const useTemplates = () => {
  return useQuery({
    queryKey: gmailKeys.templates,
    queryFn: getAllTemplates,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gmailKeys.templates });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTemplateRequest> }) => 
      updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gmailKeys.templates });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gmailKeys.templates });
    },
  });
};
