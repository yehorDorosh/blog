import { Component, input, inject } from '@angular/core';
import { UserService } from '../../user/user.service';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../blog/article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-tools',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-tools.component.html',
  styleUrl: './admin-tools.component.scss',
})
export class AdminToolsComponent {
  userService = inject(UserService);
  articleService = inject(ArticleService);
  router = inject(Router);

  nodeId = input<string>();

  onDeleteArticle() {
    const article = this.articleService
      .articles()
      .find((article) => article.id === this.nodeId());
    if (article) {
      this.articleService.deleteArticle(article.id!);
    }
  }
}
