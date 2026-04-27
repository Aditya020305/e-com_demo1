import API from "../api/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "vendor" | "admin";
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await API.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string = "user"
): Promise<AuthResponse> => {
  const { data } = await API.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return data;
};
