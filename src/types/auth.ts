export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "MANAGER" | "ADMIN" | "MODERATOR" | "SUPPORT_AGENT";
  profileImage?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: IUser;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: IUser;
}