export interface IGallery {
  id: string;
  title: string;
  imageUrl: string;
  likesCount: number;
  createdAt: string;
  userId: string;
  user: {
    name: string;
    profileImage?: string;
  };
}

export interface IGalleryMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IGalleryResponse {
  data: IGallery[];
  meta: IGalleryMeta;
}