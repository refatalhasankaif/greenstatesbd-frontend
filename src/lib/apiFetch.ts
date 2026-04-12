import { getToken } from "@/lib/auth-token";

export const API = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async <T>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    const token = getToken();

    const res = await fetch(`${API}${url}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(options.headers || {}),
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
};