import { LangList } from '../lang-switcher/lang-switcher.model';

export type TranslatableContent = {
  [key in LangList]: string;
};

export interface BlogArticle {
  id?: string;
  title: TranslatableContent;
  content: TranslatableContent;
  img: {
    pageHero: string;
    editorImages: string[];
  };
  published: boolean;
  date: string;
  author: string;
  tags: TagId[];
}

export type TagId = string;

export interface Tag {
  id: TagId;
  label: TranslatableContent;
}

export type Tags = Tag[];

export interface GetTagsResponse {
  [tagId: string]: Tag;
}

export interface BlogArticleResponse {
  [blogId: string]: BlogArticle;
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
