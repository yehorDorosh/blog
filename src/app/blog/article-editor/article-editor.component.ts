import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../article.service';
import { BlogArticle, TranslatableContent } from '../blog.model';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import { LangList } from '../../lang-switcher/lang-switcher.model';
import { CommonModule } from '@angular/common';
import { TagService } from '../../admin/tags-manager/tag.service';
import translit from '../../utils/translit';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, AngularEditorModule],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss',
})
export class ArticleEditorComponent implements OnInit {
  private articleService = inject(ArticleService);
  private router = inject(Router);
  private tagService = inject(TagService);
  langSwitcherService = inject(LangSwitcherService);

  article = input<BlogArticle>();

  title: TranslatableContent = {
    en: '',
    ru: '',
    uk: '',
  };
  titleField = '';
  summary: TranslatableContent = {
    en: '',
    ru: '',
    uk: '',
  };
  summaryField = '';
  content: TranslatableContent = {
    en: '',
    ru: '',
    uk: '',
  };
  contentField = '';
  pageHeroPath = '';
  published = {
    en: false,
    ru: false,
    uk: false,
  };
  publishedField = false;
  author = 'admin';
  date: string = new Date().toISOString().split('T')[0];
  url = '';
  autoUrl = true;
  isUrlNotunique = false;
  metaTitle: TranslatableContent = {
    en: '',
    ru: '',
    uk: '',
  };
  metaTitleField = '';
  metaDescription: TranslatableContent = {
    en: '',
    ru: '',
    uk: '',
  };
  metaDescriptionField = '';
  top = false;

  tagsList = computed(() => {
    return this.tagService.tagsList().map((tag) => {
      return {
        ...tag,
        selected: false,
      };
    });
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '70vh',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    upload: this.uploadEditorImage.bind(this),
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };

  ngOnInit() {
    const editorLang = this.langSwitcherService.editorLang();
    this.tagService.getTags(() => {
      if (!this.article() || !this.article()?.tags) return;
      this.tagsList().forEach((tag) => {
        const articleTag = this.article()!.tags.find(
          (articleTag) => articleTag === tag.id
        );
        if (articleTag) tag.selected = true;
      });
    });

    if (this.article && this.article() && this.article()?.id) {
      this.title = this.article()!.title;
      this.titleField = this.article()!.title[editorLang];
      this.summary = this.article()!.summary;
      this.summaryField = this.article()!.summary[editorLang];
      this.content = this.article()!.content;
      this.contentField = this.article()!.content[editorLang];
      this.pageHeroPath = this.article()!.img.pageHero;
      this.published = this.article()!.published;
      this.publishedField = this.article()!.published[editorLang];
      this.author = this.article()!.author;
      this.date = new Date(this.article()!.date).toISOString().split('T')[0];
      this.articleService.articleId.set(this.article()!.id!);
      this.articleService.editorImages = this.article()!.img.editorImages || [];
      this.url = this.article()!.url;
      this.autoUrl = this.article()!.autoUrl;
      this.top = this.article()!.top;
      this.metaTitle = this.article()!.metaTitle;
      this.metaTitleField = this.article()!.metaTitle[editorLang];
      this.metaDescription = this.article()!.metaDescription;
      this.metaDescriptionField = this.article()!.metaDescription[editorLang];
    }
  }

  uploadEditorImage(file: File) {
    const id = this.articleService.articleId();
    if (!id) return throwError(() => new Error('Article ID not found'));
    return this.articleService.uploadImageEditor(id, file);
  }

  onTitleFieldChange() {
    this.title[this.langSwitcherService.editorLang()] = this.titleField;

    if (this.autoUrl && !this.article()?.url) {
      this.url = translit(
        this.title[this.langSwitcherService.editorLang()].toLowerCase()
      );
    }
  }

  onSummaryFieldChange() {
    this.summary[this.langSwitcherService.editorLang()] = this.summaryField;
  }

  onContentFieldChange() {
    this.content[this.langSwitcherService.editorLang()] = this.contentField;
  }

  onPublishedFieldChange() {
    this.published[this.langSwitcherService.editorLang()] = this.publishedField;
  }

  onAutoUrlChange() {
    if (this.autoUrl) {
      this.url = translit(
        this.title[this.langSwitcherService.editorLang()].toLowerCase()
      );
    }
  }

  onUrlChange() {
    this.isUrlNotunique = false;
  }

  onMetaTitleFieldChange() {
    this.metaTitle[this.langSwitcherService.editorLang()] = this.metaTitleField;
  }

  onMetaDescriptionFieldChange() {
    this.metaDescription[this.langSwitcherService.editorLang()] =
      this.metaDescriptionField;
  }

  async onPageHeroSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const id = this.articleService.articleId();
    if (input.files && input.files.length > 0 && id) {
      this.pageHeroPath = await this.articleService.uploadImage(
        id,
        input.files[0]
      );
    }
  }

  onRemovePageHero() {
    this.articleService.deleteImage(this.pageHeroPath);
    this.pageHeroPath = '';
  }

  onSubmit() {
    const id = this.articleService.articleId();
    const articles = this.articleService
      .articles()
      ?.filter((article) => article.id !== id);
    this.isUrlNotunique = articles?.some(
      (someArticle) => someArticle.url === this.url
    );

    if (!id || this.isUrlNotunique) return;

    this.articleService.saveArticle({
      articleId: id,
      userId: this.article()?.userId || '',
      title: this.title,
      summary: this.summary,
      content: {
        en: this.htmlParser(this.content.en),
        ru: this.htmlParser(this.content.ru),
        uk: this.htmlParser(this.content.uk),
      },
      pageHeroPath: this.pageHeroPath,
      published: this.published,
      author: this.author,
      date: new Date(this.date),
      tags: this.tagsList()
        .filter((tag) => tag.selected)
        .map((tag) => tag.id),
      url: this.url,
      autoUrl: this.autoUrl,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      top: this.top,
    });
  }

  onCancel() {
    this.router.navigate(['../'], { state: { canLeave: true } });
  }

  onChangeEditorLang(e: Event) {
    if (this.article()) {
      this.article()!.title[this.langSwitcherService.editorLang()] =
        this.titleField;
      this.article()!.summary[this.langSwitcherService.editorLang()] =
        this.summaryField;
      this.article()!.content[this.langSwitcherService.editorLang()] =
        this.contentField;
      this.article()!.published[this.langSwitcherService.editorLang()] =
        this.publishedField;
      this.article()!.metaTitle[this.langSwitcherService.editorLang()] =
        this.metaTitleField;
      this.article()!.metaDescription[this.langSwitcherService.editorLang()] =
        this.metaDescriptionField;
    }

    const target = e.target as HTMLSelectElement;

    this.langSwitcherService.editorLang.set(target.value as LangList);

    if (this.article()) {
      this.titleField =
        this.article()!.title[this.langSwitcherService.editorLang()];
      this.summaryField =
        this.article()!.summary[this.langSwitcherService.editorLang()];
      this.contentField =
        this.article()!.content[this.langSwitcherService.editorLang()];
      this.publishedField =
        this.article()!.published[this.langSwitcherService.editorLang()];
      this.metaTitleField =
        this.article()!.metaTitle[this.langSwitcherService.editorLang()];
      this.metaDescriptionField =
        this.article()!.metaDescription[this.langSwitcherService.editorLang()];
    }
  }

  htmlParser(html: string) {
    if (!html) return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const links = doc.querySelectorAll('a');
    const images = doc.querySelectorAll('img');

    links.forEach((link) => {
      if (link.hostname !== window.location.hostname) {
        link.setAttribute('rel', 'nofollow noopener');
      }
    });

    images.forEach((image) => {
      if (image.src.includes(window.location.hostname)) {
        const url = new URL(image.src);
        image.src = url.pathname;
      }
    });

    return doc.body.innerHTML;
  }
}
