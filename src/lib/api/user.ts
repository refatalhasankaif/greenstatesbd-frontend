import { API } from "@/lib/api";
import { getToken } from "@/lib/auth-token";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  verificationStatus: string;
  createdAt: string;
}

export const getMyProfile = async (): Promise<IUser> => {
  const token = getToken();
  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
};

export const updateMyProfile = async (payload: {
  name?: string;
  profileImage?: string;
}): Promise<IUser> => {
  const token = getToken();
  const res = await fetch(`${API}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Update failed");
  return json.data;
};