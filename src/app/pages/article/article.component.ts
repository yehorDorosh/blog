import {
  Component,
  input,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { type BlogArticle } from '../../blog/blog.model';
import { ArticleService } from '../../blog/article.service';
import { HeaderComponent } from '../../layout/header/header.component';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [HeaderComponent, SanitizeHtmlPipe],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  articleService = inject(ArticleService);
  paramArticleId = input.required<string>();
  article = computed<BlogArticle | undefined>(() => {
    return this.articles().find(
      (article) => article.id === this.paramArticleId()
    );
  });
  articles = computed<BlogArticle[]>(() => {
    return this.articleService.articles();
  });

  ngOnInit(): void {
    this.articleService.getArticles();
  }
}
