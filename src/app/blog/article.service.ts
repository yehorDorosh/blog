import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { type ImageType, type FireBaseResponse } from './blog.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);

  createArticle(data: { title: string, content: string, pageheroImg: File }) {
    const subscriptionDB = this.httpClient.post<FireBaseResponse>(
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
      subscriptionDB.unsubscribe();
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
        console.log('Add image name to article', response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        subscription.unsubscribe();
      }
    });
  }

  deleteArticle(articleId: string, imageName: string) {
    const subscription = this.httpClient.delete<null>(
      `${environment.realBaseApiUrl}/blog/${articleId}.json?auth=${this.userService.getToken}`
    ).subscribe({
      next: (response) => {
        console.log('Delete article', response);
        this.deleteImage(imageName);
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
