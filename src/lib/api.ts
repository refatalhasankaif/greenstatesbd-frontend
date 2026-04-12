import { getToken } from "@/lib/auth-token";

export const API = process.env.NEXT_PUBLIC_API_URL;

type ApiError = {
    message?: string;
};

export const post = async <TResponse, TBody = unknown>(
    url: string,
    data: TBody
): Promise<TResponse> => {
    const token = getToken();

    const res = await fetch(`${API}${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });

    const json = (await res.json()) as TResponse & ApiError;

    if (!res.ok) {
        throw new Error(json.message || "Something went wrong");
    }

    return json;
};