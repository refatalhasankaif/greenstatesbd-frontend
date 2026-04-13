import { API } from "@/lib/api";
import { getToken } from "@/lib/auth-token";
import {
  IProperty,
  IPropertyResponse,
  ICreatePropertyPayload,
} from "@/types/property";

export const getProperties = async (
  page = 1,
  limit = 9,
  params?: Record<string, string>
): Promise<IPropertyResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...params,
  });
  const res = await fetch(`${API}/properties?${query}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return { data: json.data, meta: json.meta };
};

export const getPropertyById = async (id: string): Promise<IProperty> => {
  const res = await fetch(`${API}/properties/${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
};

export const createProperty = async (
  payload: ICreatePropertyPayload
): Promise<IProperty> => {
  const token = getToken();
  const res = await fetch(`${API}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create property");
  return json.data;
};

export const updateProperty = async (
  id: string,
  payload: Partial<ICreatePropertyPayload>
): Promise<IProperty> => {
  const token = getToken();
  const res = await fetch(`${API}/properties/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update property");
  return json.data;
};

export const uploadPropertyImages = async (
  propertyId: string,
  files: File[]
): Promise<void> => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found");
  }


  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const res = await fetch(`${API}/properties/${propertyId}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Upload error: ${res.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to upload images: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};


export const placeBid = async (
  propertyId: string,
  amount: number
): Promise<void> => {
  const token = getToken();
  const res = await fetch(`${API}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ propertyId, amount }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Bid failed");
  return json.data;
};

export const getBidsByProperty = async (
  propertyId: string,
  page = 1,
  limit = 10
) => {
  const res = await fetch(
    `${API}/bids/property/${propertyId}?page=${page}&limit=${limit}`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return { data: json.data, meta: json.meta };
};

export const acceptBid = async (
  propertyId: string,
  bidId: string
): Promise<IProperty> => {
  const token = getToken();
  const res = await fetch(`${API}/properties/${propertyId}/accept-bid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bidId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to accept bid");
  return json.data;
};

export const updatePropertyStatus = async (
  propertyId: string,
  status: string
): Promise<IProperty> => {
  const token = getToken();
  const res = await fetch(`${API}/properties/${propertyId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update status");
  return json.data;
};


export const reportProperty = async (
  propertyId: string,
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
    body: JSON.stringify({ propertyId, type, message }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Report failed");
};


export const sendMessage = async (
  receiverId: string,
  text: string
): Promise<void> => {
  const token = getToken();
  const res = await fetch(`${API}/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ receiverId, text }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Message failed");
};
