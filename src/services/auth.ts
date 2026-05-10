import api from "@/lib/api";
import { User } from "@/types/auth";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginPayload) => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get<User>("/auth/profile");
  return response.data;
};
