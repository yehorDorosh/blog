import { Component, input, inject, computed } from '@angular/core';
import { type BlogArticle } from '../../blog.model';
import { ArticleService } from '../../article.service';
import { RouterLink } from '@angular/router';
import { LangSwitcherService } from '../../../lang-switcher/lang-switcher.service';

@Component({
  selector: 'li[appArticlePreview]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './article-preview.component.html',
  styleUrl: './article-preview.component.scss',
})
export class ArticlePreviewComponent {
  private articleService = inject(ArticleService);
  langSwitcherService = inject(LangSwitcherService);

  article = input.required<BlogArticle>();
  simple = input<boolean>(false);
  order = input<'odd' | 'even'>('odd');

  articleTitle = computed<string>(() => {
    const title = this.article().title;
    return title[this.langSwitcherService.lang()];
  });

  articleImg = computed<string>(() => {
    return this.article().img.pageHero;
  });

  articleDate = computed<string>(() => {
    return new Date(this.article().date).toLocaleDateString();
  });

  articleSummary = computed<string>(() => {
    const summary = this.article().summary;
    return summary[this.langSwitcherService.lang()];
  });
}
