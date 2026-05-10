import { useMutation } from "@tanstack/react-query";
import { register, login, resetPassword, RegisterRequest, LoginRequest, ResetPasswordRequest } from "./calls";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export const useRegister = () => {
  const loginToStore = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    },
  });
};

export const useLogin = () => {
  const loginToStore = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
};
