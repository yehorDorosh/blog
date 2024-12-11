import { Component, computed, inject, input, signal } from '@angular/core';
import { ArticlePreviewComponent } from './article-preview/article-preview.component';
import { ArticleService } from '../article.service';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import { TagsComponent } from '../tags/tags.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [ArticlePreviewComponent, TagsComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent {
  articleService = inject(ArticleService);
  langSwitcherService = inject(LangSwitcherService);

  isAdminAccess = input<boolean>(false);
  simple = input<boolean>(false);

  activeTags = signal<string[]>([]);

  articlesList = computed(() => {
    return this.articleService
      .articles()
      .filter(
        (article) =>
          (article.published[this.langSwitcherService.lang()] &&
            this.activeTags().length === 0) ||
          article.tags.some((articleTag) => {
            return this.activeTags().includes(articleTag);
          }) ||
          this.isAdminAccess()
      )
      .sort((a, b) => {
        if (a.top && !b.top) {
          return -1;
        }
        if (!a.top && b.top) {
          return 1;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  });

  ngOnInit(): void {
    this.articleService.getArticles();
  }

  onTagSelected(id: string) {
    this.activeTags.update((tags) => {
      if (tags.includes(id)) {
        return tags.filter((tag) => tag !== id);
      }
      return [...tags, id];
    });
  }
}
