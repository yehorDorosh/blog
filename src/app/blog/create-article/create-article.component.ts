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

  form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl('')
  });

  onSubmit() {
    console.log(this.form.value);

    const subscription = this.httpClient.post(
        `${environment.realBaseApiUrl}/blog.json?auth=${this.userService.getToken()}`,
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
