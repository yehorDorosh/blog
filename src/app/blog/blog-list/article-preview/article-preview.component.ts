import { Component, input, inject, computed } from '@angular/core';
import { type BlogArticle } from '../../blog.model';
import { ArticleService } from '../../article.service';
import { RouterLink } from '@angular/router';
import { LangSwitcherService } from '../../../lang-switcher/lang-switcher.service';

@Component({
  selector: 'app-article-preview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './article-preview.component.html',
  styleUrl: './article-preview.component.scss',
})
export class ArticlePreviewComponent {
  private articleService = inject(ArticleService);
  langSwitcherService = inject(LangSwitcherService);

  article = input.required<BlogArticle>();
  lang = this.langSwitcherService.lang();

  articleTitle = computed<string>(() => {
    const title = this.article().title;
    return title[this.lang] ?? title.en;
  });
}
