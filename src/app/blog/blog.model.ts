import { LangList } from '../lang-switcher/lang-switcher.model';

export type TranslatableContent = {
  [key in LangList]: string;
};

export type TranslatableCheckbox = {
  [key in LangList]: boolean;
};

export interface BlogArticle {
  id?: string;
  userId?: string;
  title: TranslatableContent;
  summary: TranslatableContent;
  content: TranslatableContent;
  img: {
    pageHero: string;
    editorImages: string[];
  };
  published: TranslatableCheckbox;
  date: string;
  author: string;
  tags: TagId[];
  url: string;
  autoUrl: boolean;
  metaTitle: TranslatableContent;
  metaDescription: TranslatableContent;
  top: boolean;
}

export type TagId = string;

export interface Tag {
  id: TagId;
  userId: string;
  label: TranslatableContent;
}

export type Tags = Tag[];

export interface GetTagsResponse {
  [localId: string]: {
    [tagId: string]: Tag;
  };
}

export interface BlogArticleResponse {
  [localId: string]: {
    [blogId: string]: BlogArticle;
  };
}

export interface FireBaseResponse {
  name: string;
}

export type ImageType = keyof BlogArticle['img'];

export interface R2Response {
  $metadata: {
    httpStatusCode: number;
    attempts: number;
    totalRetryDelay: number;
  };
  ETag: string;
  VersionId: string;
}

export const isR2Response = (response: any): response is R2Response => {
  return response.$metadata !== undefined;
};
