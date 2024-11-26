import { Component, computed, inject, input } from '@angular/core';
import { ArticlePreviewComponent } from './article-preview/article-preview.component';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [ArticlePreviewComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent {
  articleService = inject(ArticleService);

  isAdminAccess = input<boolean>(false);
  simple = input<boolean>(false);

  articlesList = computed(() => {
    return this.articleService
      .articles()
      .filter((article) => article.published || this.isAdminAccess());
  });

  ngOnInit(): void {
    this.articleService.getArticles();
  }
}
