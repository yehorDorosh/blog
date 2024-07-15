import { Component, inject } from '@angular/core';
import { CreateArticleComponent } from "../../blog/create-article/create-article.component";
import { UserService } from "../../user/user.service";
import { BlogListComponent } from "../../blog/blog-list/blog-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CreateArticleComponent, BlogListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private userService = inject(UserService);

  onLogout() {
    this.userService.logout();
  }
}
