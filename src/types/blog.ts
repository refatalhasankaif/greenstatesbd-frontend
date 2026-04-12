export interface IUser {
  id: string;
  name: string;
}

export interface IBlog {
  id: string;
  title: string;
  content: string;
  createdAt: string;

  authorId: string;
  author: IUser;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IBlogResponse {
  meta: IPaginationMeta;
  data: IBlog[];
}