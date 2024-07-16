import { Component, input, inject, OnInit, signal } from '@angular/core';
import { type BlogArticle } from '../../blog/blog.model'
import { ArticleService } from '../../blog/article.service';
import { HeaderComponent } from "../../layout/header/header.component";

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  articleService = inject(ArticleService);
  paramArticleId = input.required<string>();
  article = signal<BlogArticle | undefined>(undefined);

  ngOnInit(): void {
    this.articleService.getArticles();
    const article = this.articleService.articles().find(article => article.id === this.paramArticleId())
    if (article) {
      this.article.set(article);
    }
  }
}
