import { Component, input, inject } from '@angular/core';
import { type BlogArticle } from '../../blog.model';
import { ArticleService } from '../../article.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-preview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './article-preview.component.html',
  styleUrl: './article-preview.component.scss'
})
export class ArticlePreviewComponent {
  private articleService = inject(ArticleService);

  article = input.required<BlogArticle>();
}
