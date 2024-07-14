export interface BlogArticle {
    id?: string;
    title: string;
    content: string;
    img: {
        pagehero: string;
    }
}

export interface BlogArticleResponse {
    [blogId: string]: BlogArticle;
}

export interface FireBaseResponse {
    name: string;
}

export type ImageType = keyof BlogArticle['img'];
