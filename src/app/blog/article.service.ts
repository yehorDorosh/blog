import { Injectable, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { type ImageType, type FireBaseResponse, type BlogArticle, type BlogArticleResponse } from './blog.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService implements OnInit {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  private getArticlesSubscription!: Subscription;

  articles = signal<BlogArticle[]>([]);

  ngOnInit() {
    this.getArticles();
    this.destroyRef.onDestroy(() => {
      this.getArticlesSubscription.unsubscribe();
    });
  }

  getArticles() {
    this.getArticlesSubscription = this.httpClient.get<BlogArticleResponse>(`${environment.realBaseApiUrl}/blog.json`)
    .subscribe({
      next: (response) => {
        if (!response) {
          this.articles.set([])
        } else {
          this.articles.set(Object.keys(response).map(id => {
            return { id, ...response[id] };
          }));
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Get articles completed.');
      }
    });
  }

  createArticle(data: { title: string, content: string, pageheroImg: File }) {
    const subscription = this.httpClient.post<FireBaseResponse>(
      `${environment.realBaseApiUrl}/blog.json?auth=${this.userService.getToken}`,
      {
        title: data.title,
        content: data.content,
      }
    ).subscribe({
    next: (response) => {
      console.log('Save article', response);
      this.uploadImage(response.name, data.pageheroImg);
    },
    error: (error) => {
      console.error(error);
    },
    complete: () => {
      subscription.unsubscribe();
    }
  });
  }

  private uploadImage(articleId: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const subscription = this.httpClient.post(
      `/api/upload-image?id=${articleId}`,
      formData,
    ).subscribe({
      next: (response) => {
        console.log('Upload image', response);
        this.saveImageName(articleId, 'pagehero', file.name);
      },
      error: (error) => {
        console.error(error);
        this.deleteArticle(articleId);
      },
      complete: () => {
        subscription.unsubscribe();
      }
    });
  }

  private saveImageName(articleId: string, imageType: ImageType, imageName: string) {
    const subscription = this.httpClient.patch(
      `${environment.realBaseApiUrl}/blog/${articleId}.json?auth=${this.userService.getToken}`,
      {
        img: {
          [imageType]: `/api/image/${articleId}/${imageName}`,
        }
      }
    ).subscribe({
      next: (response) => {
        console.log('Save image name to article', response);
        this.getArticles();
      },
      error: (error) => {
        console.error(error);
        this.deleteArticle(articleId, imageName);
      },
      complete: () => {
        subscription.unsubscribe();
      }
    });
  }

  deleteArticle(articleId: string, imageName?: string) {
    const subscription = this.httpClient.delete<null>(
      `${environment.realBaseApiUrl}/blog/${articleId}.json?auth=${this.userService.getToken}`
    ).subscribe({
      next: (response) => {
        console.log('Delete article', response);
        if(imageName) this.deleteImage(imageName);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        subscription.unsubscribe();
      }
    });
  }

  deleteImage(imageName: string) {
    const subscription = this.httpClient.delete(
      `${imageName}`).subscribe({
      next: (response) => {
        console.log('Remove image.', response);
        this.getArticles();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        subscription.unsubscribe();
      }
    });
  }

  
}
