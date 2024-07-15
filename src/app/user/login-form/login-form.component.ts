import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit() {
    const subscription = this.httpClient.post<User>(
        `${environment.authApiUrlLogin}?key=${environment.firebaseApiKey}`,
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
          localId: response.localId,
          logOutDate: null
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
