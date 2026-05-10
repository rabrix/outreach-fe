import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  uploadLeads, 
  deleteLead, 
  deleteLeadList, 
  getLeadList, 
  getAllLeadLists,
  getLeadsByLeadList,
  UploadLeadsRequest 
} from "./calls";

// Mutations
export const useUploadLeads = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UploadLeadsRequest) => uploadLeads(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadLists"] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leadId: string) => deleteLead(leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leadList"] });
    },
  });
};

export const useDeleteLeadList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leadListId: string) => deleteLeadList(leadListId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadLists"] });
    },
  });
};

// Queries
export const useLeadList = (leadListId: string) => {
  return useQuery({
    queryKey: ["leadList", leadListId],
    queryFn: () => getLeadList(leadListId),
    enabled: !!leadListId,
  });
};

export const useAllLeadLists = () => {
  return useQuery({
    queryKey: ["leadLists"],
    queryFn: () => getAllLeadLists(),
  });
};

export const useLeadsByList = (leadListId: string) => {
  return useQuery({
    queryKey: ["leads", leadListId],
    queryFn: () => getLeadsByLeadList(leadListId),
    enabled: !!leadListId,
  });
};
