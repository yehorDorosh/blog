import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user/user.service';
import { environment } from '../../../environments/environment';
import { ImageType, type FireBaseResponse } from '../blog.model';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);
  private selectedFile: File | null = null;

  form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const subscriptionDB = this.httpClient.post<FireBaseResponse>(
        `${environment.realBaseApiUrl}/blog.json?auth=${this.userService.getToken}`,
        {
          title: this.form.value.title,
          content: this.form.value.content,
        }
      ).subscribe({
      next: (response) => {
        console.log('Save article', response);
        this.uploadImage(response.name);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        subscriptionDB.unsubscribe();
      }
    });
  }

  private uploadImage(articleId: string) {
    const formData = new FormData();
    formData.append('image', this.selectedFile!);

    const subscription = this.httpClient.post(
      `/api/upload-image?id=${articleId}`,
      formData,
    ).subscribe({
      next: (response) => {
        console.log('Upload image', response);
        this.saveImageName(articleId, 'pagehero', this.selectedFile!.name);
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
}
