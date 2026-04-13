import { API } from "@/lib/api";
import { getToken } from "@/lib/auth-token";

export interface IVerificationRequest {
  id: string;
  documentUrl: string;
  note?: string;
  status: "NOT_VERIFIED" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  userId: string;
}

export const getMyVerificationRequest =
  async (): Promise<IVerificationRequest | null> => {
    const token = getToken();
    const res = await fetch(`${API}/verification/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) return null;
    return json.data;
  };

export const submitVerificationRequest = async (payload: {
  documentUrl: string;
  note?: string;
}): Promise<IVerificationRequest> => {
  const token = getToken();
  const res = await fetch(`${API}/verification`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Submission failed");
  return json.data;
};