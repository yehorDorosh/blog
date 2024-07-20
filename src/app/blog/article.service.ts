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

  articleId = '';
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
          this.articleId = response.name;
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
            const modifiedResponse = new HttpResponse({
              body: {
                imageUrl: `/api/image/common/${file.name}`,
              },
            });
            console.log('$metadata' in response);
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
          },
        }
      )
      .subscribe({
        next: (response) => {
          console.log('Save article', response);
          this.router.navigate(['blog', articleId]);
          this.getArticles();
        },
        error: (error) => {
          console.error(error);
          this.deleteArticle(articleId, pageHero);
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  deleteArticle(articleId: string, imageName?: string) {
    const subscription = this.httpClient
      .delete<null>(
        `${environment.realBaseApiUrl}/blog/${articleId}.json?auth=${this.userService.getToken}`
      )
      .subscribe({
        next: (response) => {
          console.log('Delete article', response);
          if (imageName) this.deleteImage(imageName);
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
