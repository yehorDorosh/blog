import { Component, inject } from '@angular/core';
import { LoginFormComponent } from "../../user/login-form/login-form.component";
import { SignupFormComponent } from "../../user/signup-form/signup-form.component";
import { CreateArticleComponent } from "../../blog/create-article/create-article.component";
import { UserService } from "../../user/user.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginFormComponent, SignupFormComponent, CreateArticleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private userService = inject(UserService);

  onLogout() {
    this.userService.logout();
  }
}
