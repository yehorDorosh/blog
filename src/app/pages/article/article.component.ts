import { Component, input, inject, OnInit, signal } from '@angular/core';
import { type BlogArticle } from '../../blog/blog.model'
import { ArticleService } from '../../blog/article.service';
import { Router } from '@angular/router';
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
  router = inject(Router);
  paramArticleId = input.required<string>();
  article = signal<BlogArticle | undefined>(undefined);

  ngOnInit(): void {
    const article = this.articleService.articles().find(article => article.id === this.paramArticleId())
    if (article) {
      this.article.set(article);
    }
  }

  onDeleteArticle() {
    const article = this.article();
    if (article) {
      this.articleService.deleteArticle(article.id!, article.img.pagehero);
      this.router.navigate(['../'], {
        replaceUrl: true,
      });
    }
  }
}
