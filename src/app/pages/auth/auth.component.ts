import { Component, signal, OnInit, inject } from '@angular/core';
import { SignupFormComponent } from '../../user/signup-form/signup-form.component';
import { LoginFormComponent } from '../../user/login-form/login-form.component';
import { PageComponent } from '../../layout/page/page.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [SignupFormComponent, LoginFormComponent, PageComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  meta = inject(Meta);
  title = inject(Title);

  formSwitcher = signal<'login' | 'signup'>('login');

  onSwitchForm() {
    this.formSwitcher.update((value) => {
      return value === 'login' ? 'signup' : 'login';
    });
  }

  ngOnInit() {
    this.title.setTitle('Auth');
    this.meta.addTag({ name: 'description', content: 'Auth' });
  }
}
