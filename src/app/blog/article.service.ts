import { Injectable, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { UserService } from '../user/user.service';
import {
  type FireBaseResponse,
  type BlogArticle,
  type BlogArticleResponse,
  isR2Response,
} from './blog.model';
import { map, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UploadResponse } from '@kolkov/angular-editor';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ArticleService implements OnInit {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  private getArticlesSubscription!: Subscription;

  articleImages: string[] = [];
  editorImages: string[] = [];
  articleId = signal<string | null>(null);
  articles = signal<BlogArticle[]>([]);

  ngOnInit() {
    this.getArticles();
    this.destroyRef.onDestroy(() => {
      this.getArticlesSubscription.unsubscribe();
    });
  }

  getArticles() {
    this.getArticlesSubscription = this.httpClient
      .get<BlogArticleResponse>(`${environment.realBaseApiUrl}/blog.json`)
      .subscribe({
        next: (response) => {
          if (!response) {
            this.articles.set([]);
          } else {
            this.articles.set(
              Object.keys(response).map((id) => {
                return { id, ...response[id] };
              })
            );
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('Get articles completed.');
        },
      });
  }

  createEmptyArticle() {
    const subscription = this.httpClient
      .post<FireBaseResponse>(
        `${environment.realBaseApiUrl}/blog.json?auth=${this.userService.getToken}`,
        {}
      )
      .subscribe({
        next: (response) => {
          console.log('Create new empty article.', response);
          this.articleId.set(response.name);
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['admin']);
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  uploadImage(articleId: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const subscription = this.httpClient
      .post(`/api/upload-image?id=${articleId}`, formData)
      .subscribe({
        next: (response) => {
          this.articleImages.push(`/api/image/${articleId}/${file.name}`);
          console.log('Upload image', response);
        },
        error: (error) => {
          console.error(error);
          this.deleteArticle(articleId);
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  uploadImageEditor(articleId: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const observer = this.httpClient
      .post<HttpEvent<UploadResponse>>(
        `/api/upload-image?id=${articleId}`,
        formData
      )
      .pipe(
        map((response) => {
          if (
            isR2Response(response) &&
            response.$metadata.httpStatusCode === 200
          ) {
            const imageUrl = `/api/image/${articleId}/${file.name}`;
            const modifiedResponse = new HttpResponse({
              body: {
                imageUrl,
              },
            });
            this.editorImages.push(imageUrl);
            console.log('Image from editor uploaded.');
            return modifiedResponse;
          } else {
            return response;
          }
        })
      );

    return observer;
  }

  saveArticle(
    articleId: string,
    title: string,
    content: string,
    pageHero: string
  ) {
    const subscription = this.httpClient
      .patch(
        `${environment.realBaseApiUrl}/blog/${articleId}.json?auth=${this.userService.getToken}`,
        {
          title,
          content,
          img: {
            pageHero: `/api/image/${articleId}/${pageHero}`,
            editorImages: this.editorImages,
          },
        }
      )
      .subscribe({
        next: (response) => {
          console.log('Save article', response);
          this.router.navigate(['blog', articleId], {
            state: { canLeave: true },
          });
          this.getArticles();
        },
        error: (error) => {
          console.error(error);
          this.deleteArticle(articleId);
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  deleteArticle(articleId: string) {
    const subscription = this.httpClient
      .delete<null>(
        `${environment.realBaseApiUrl}/blog/${articleId}.json?auth=${this.userService.getToken}`
      )
      .subscribe({
        next: (response) => {
          const article = this.articles().find(
            (article) => article.id === articleId
          );
          if (article) {
            this.deleteImage(article.img.pageHero);
            article.img.editorImages.forEach((img) => {
              this.deleteImage(img);
            });
          }

          console.log('Delete article', response);
          this.router.navigate(['../'], {
            replaceUrl: true,
            state: { canLeave: true },
          });
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  deleteImage(imageName: string) {
    const subscription = this.httpClient.delete(`${imageName}`).subscribe({
      next: (response) => {
        console.log('Remove image.', response);
        this.getArticles();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }
}
