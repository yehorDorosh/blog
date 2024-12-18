import { Component, input, inject, computed } from '@angular/core';
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
      if (
        confirm(
          `Are you sure you want to delete this article? ${
            article.title.en || article.title.ru || article.title.uk
          }`
        )
      ) {
        this.articleService.deleteArticle(article.id!);
      }
    }
  }

  isEditable = computed(() => {
    const article = this.articleService
      .articles()
      .find((article) => article.id === this.nodeId());
    return article?.userId === this.userService.user()?.localId;
  });
}
