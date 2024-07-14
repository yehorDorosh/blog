import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user/user.service';
import { environment } from '../../../environments/environment';

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
    const formData = new FormData();
    formData.append('image', this.selectedFile!);

    const subscriptionServer = this.httpClient.post(
      `/api/upload-image`,
      formData,
    ).subscribe({
    next: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.error(error);
    },
    complete: () => {
      subscriptionServer.unsubscribe();
    }
  });

    return;
    const subscriptionDB = this.httpClient.post(
        `${environment.realBaseApiUrl}/blog.json?auth=${this.userService.getToken}`,
        {
          title: this.form.value.title,
          content: this.form.value.content,
          image: this.selectedFile?.name
        }
      ).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        subscriptionDB.unsubscribe();
      }
    });
  }
}
