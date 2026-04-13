export type PropertyType = "APARTMENT" | "LAND" | "HOUSE" | "COMMERCIAL";
export type Division =
  | "DHAKA"
  | "CHITTAGONG"
  | "KHULNA"
  | "RAJSHAHI"
  | "SYLHET"
  | "BARISAL"
  | "RANGPUR"
  | "MYMENSINGH";
export type PropertyStatus =
  | "ACTIVE"
  | "CLOSED"
  | "HANDED_OVER"
  | "SOLD";

export interface IPropertyImage {
  id: string;
  url: string;
  propertyId: string;
  createdAt: string;
}

export interface IBid {
  id: string;
  amount: number;
  status: "ACTIVE" | "WON" | "LOST" | "CANCELLED";
  createdAt: string;
  userId: string;
  propertyId: string;
  user?: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface IProperty {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  currentBid?: number;
  location: Division;
  address?: string;
  type: PropertyType;
  status: PropertyStatus;
  biddingStart?: string;
  biddingEnd?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    profileImage?: string;
  };
  images: IPropertyImage[];
  bids?: IBid[];
  _count?: {
    bids: number;
  };
}

export interface IPropertyMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IPropertyResponse {
  data: IProperty[];
  meta: IPropertyMeta;
}

export interface ICreatePropertyPayload {
  title: string;
  description: string;
  basePrice: number;
  location: Division;
  address?: string;
  type: PropertyType;
  biddingStart?: string;
  biddingEnd?: string;
}