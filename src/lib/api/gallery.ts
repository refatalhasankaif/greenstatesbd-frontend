import { API } from "@/lib/api";
import { getToken } from "@/lib/auth-token";
import { IGallery, IGalleryResponse } from "@/types/gallery";

export const getGallery = async (
    page = 1,
    limit = 9
): Promise<IGalleryResponse> => {
    const res = await fetch(`${API}/gallery?page=${page}&limit=${limit}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return { data: json.data, meta: json.meta };
};

export const getMyGallery = async (): Promise<IGallery[]> => {
    const token = getToken();
    const res = await fetch(`${API}/gallery/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json.data;
};

export const getLikedGalleryIds = async (): Promise<string[]> => {
    const token = getToken();
    if (!token) return [];
    const res = await fetch(`${API}/gallery/liked`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) return [];
    return json.data;
};

export const uploadGallery = async (
    title: string,
    file: File
): Promise<IGallery> => {
    const token = getToken();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    const res = await fetch(`${API}/gallery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Upload failed");
    return json.data;
};

export const deleteGallery = async (id: string): Promise<void> => {
    const token = getToken();
    const res = await fetch(`${API}/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Delete failed");
};

export const likeGallery = async (
    id: string
): Promise<{ likesCount: number; liked: boolean }> => {
    const token = getToken();
    const res = await fetch(`${API}/gallery/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Like failed");
    return json.data;
};

export const reportGallery = async (
    galleryId: string,
    type: string,
    message?: string
): Promise<void> => {
    const token = getToken();
    const res = await fetch(`${API}/reports`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ galleryId, type, message }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Report failed");
};