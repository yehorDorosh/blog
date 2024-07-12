import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user/user.service';

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

  form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl('')
  });

  onSubmit() {
    console.log(this.form.value);

    const subscription = this.httpClient.post(
        `https://travel-blog-193d4-default-rtdb.europe-west1.firebasedatabase.app/blog.json?auth=${this.userService.getToken()}`,
        this.form.value
      ).subscribe({
      next: (response) => {
        console.log(response);
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
