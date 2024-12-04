import {
  Component,
  input,
  inject,
  OnInit,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { type BlogArticle } from '../../blog/blog.model';
import { ArticleService } from '../../blog/article.service';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import { LangList } from '../../lang-switcher/lang-switcher.model';
import { TagService } from '../../admin/tags-manager/tag.service';
import { DatePipe } from '@angular/common';
import { PageComponent } from '../../layout/page/page.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [SanitizeHtmlPipe, DatePipe, PageComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {
  articleService = inject(ArticleService);
  langSwitcherService = inject(LangSwitcherService);
  tagService = inject(TagService);

  paramArticleId = input.required<string>();

  lang = computed<LangList>(() => {
    return this.langSwitcherService.lang();
  });

  providedLangs = computed<LangList[] | undefined>(() => {
    if (!this.article()) return;
    return Object.entries(this.article()!.published)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key) as LangList[];
  });

  article = computed<BlogArticle | undefined>(() => {
    return this.articles().find(
      (article) => article.url === this.paramArticleId()
    );
  });

  articles = computed<BlogArticle[]>(() => {
    return this.articleService.articles();
  });

  articleContent = computed<string>(() => {
    if (!this.article()) return '';
    const content = this.article()!.content;
    return content[this.lang()] ?? content.en;
  });

  articleTitle = computed<string>(() => {
    if (!this.article()) return '';
    const title = this.article()!.title;
    return title[this.lang()] ?? title.en;
  });

  tags = computed(() => {
    if (!this.article() || !this.article()?.tags) return [];
    return this.tagService.tagsList().filter((tag) => {
      return this.article()!.tags.includes(tag.id);
    });
  });

  author = computed<string>(() => {
    if (!this.article()) return '';
    return this.article()!.author;
  });

  date = computed<string>(() => {
    if (!this.article()) return '';
    return this.article()!.date;
  });

  ngOnInit(): void {
    this.articleService.getArticles();
    this.tagService.getTags();
  }
}
