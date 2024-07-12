import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss'
})
export class SignupFormComponent {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit() {
    const subscription = this.httpClient.post<User>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCd83hTFxcsxZvT-EpCrzi9HTQM9kfgW8s',
        {
          email: this.form.value.email,
          password: this.form.value.password,
          returnSecureToken: true
        }
      ).subscribe({
      next: (response) => {
        this.userService.setUser({
          email: response.email,
          idToken: response.idToken,
          expiresIn: response.expiresIn,
          localId: response.localId
        });
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
