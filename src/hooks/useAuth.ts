import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { logoutUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout, setIsLoggingOut } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      setIsLoggingOut(true);
      return logoutUser();
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      setIsLoggingOut(false);
      router.push("/login");
      toast.success("Logged out successfully");
    },
  });
};
