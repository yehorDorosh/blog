import {
  Component,
  input,
  inject,
  OnInit,
  computed,
  ViewEncapsulation,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { type BlogArticle } from '../../blog/blog.model';
import { ArticleService } from '../../blog/article.service';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import { LangList } from '../../lang-switcher/lang-switcher.model';
import { TagService } from '../../admin/tags-manager/tag.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { PageComponent } from '../../layout/page/page.component';
import { Meta, Title } from '@angular/platform-browser';
import metaTranslations from '../../../locale/meta';
import { RouterLink } from '@angular/router';
import { TableOfContentComponent } from '../../blog/table-of-content/table-of-content.component';
import { PagesService } from '../pages.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    SanitizeHtmlPipe,
    DatePipe,
    PageComponent,
    RouterLink,
    TableOfContentComponent,
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {
  articleService = inject(ArticleService);
  langSwitcherService = inject(LangSwitcherService);
  tagService = inject(TagService);
  private meta = inject(Meta);
  private title = inject(Title);
  private pageService = inject(PagesService);
  private platformId = inject(PLATFORM_ID);

  paramArticleId = input.required<string>();

  showToTopBtn = signal(false);

  private timer?: NodeJS.Timeout;

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
    const article = this.articles().find(
      (article) => article.url === this.paramArticleId()
    );

    if (
      !article &&
      this.articles()?.length &&
      isPlatformBrowser(this.platformId)
    ) {
      window.location.href = `/${this.lang()}/404`;
    }

    if (article) {
      this.title.setTitle(
        article.metaTitle[this.lang()] ||
          metaTranslations.article.title[this.lang()]
      );
      this.meta.addTag({
        name: 'description',
        content:
          article.metaDescription[this.lang()] ||
          metaTranslations.article.description[this.lang()],
      });
      this.meta.addTag({
        property: 'og:image',
        content: article.img.pageHero
          ? `https://waves-and-mountains.blog${article.img.pageHero}`
          : 'https://waves-and-mountains.blog/assets/images/opengraph/DJI_0041.jpg',
      });
      this.meta.addTag({
        property: 'og:url',
        content: 'https://waves-and-mountains.blog/',
      });
      this.meta.addTag({
        property: 'og:type',
        content: 'article',
      });
    }

    return article;
  });

  articles = computed<BlogArticle[]>(() => {
    return this.articleService.articles();
  });

  articleContent = computed<string>(() => {
    if (!this.article()) return '';
    const content = this.article()!.content;
    return content[this.lang()];
  });

  articleTitle = computed<string>(() => {
    if (!this.article()) return '';
    const title = this.article()!.title;
    return title[this.lang()];
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

  scrollHandler = () => {
    const targetElement = document.getElementById('top');
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const topPosition = rect.top + window.scrollY;
      if (document.documentElement.scrollTop > topPosition) {
        this.showToTopBtn.set(true);
      } else {
        this.showToTopBtn.set(false);
      }
    }
  };

  ngOnInit(): void {
    this.tagService.getTags();

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.scrollHandler, 100);
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    if (isPlatformBrowser(this.platformId))
      window.removeEventListener('scroll', this.scrollHandler);
  }
}
