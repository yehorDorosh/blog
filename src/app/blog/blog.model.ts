export interface BlogArticle {
    id?: string;
    title: string;
    content: string;
    pagehero: string;
}

export interface BlogArticleResponse {
    [blogId: string]: BlogArticle;
}
