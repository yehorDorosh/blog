import { Component, signal } from '@angular/core';
import { SignupFormComponent } from "../../user/signup-form/signup-form.component";
import { LoginFormComponent } from "../../user/login-form/login-form.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [SignupFormComponent, LoginFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  formSwitcher = signal<'login' | 'signup'>('login');

  onSwitchForm() {
    this.formSwitcher.update((value) => {
      return value === 'login' ? 'signup' : 'login';
    })
  }
}
