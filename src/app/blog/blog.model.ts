import { LangList } from '../lang-switcher/lang-switcher.model';

export interface BlogArticle {
  id?: string;
  title: {
    [key in LangList]: string;
  };
  content: {
    [key in LangList]: string;
  };
  img: {
    pageHero: string;
    editorImages: string[];
  };
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
