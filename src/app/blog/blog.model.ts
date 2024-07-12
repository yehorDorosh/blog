export interface BlogArticle {
    id?: string;
    title: string;
    content: string;
}

export interface BlogArticleResponse {
    [blogId: string]: BlogArticle;
}
