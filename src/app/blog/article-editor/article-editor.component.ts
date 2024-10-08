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
  content: TranslatableContent = {
    en: '',
    ru: '',
    uk: '',
  };
  contentField = '';
  pageHeroPath = '';
  published = false;
  author = 'admin';
  date: string = new Date().toISOString().split('T')[0];

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
    height: 'auto',
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
    this.tagService.getTags(() => {
      this.tagsList().forEach((tag) => {
        const articleTag = this.article()!.tags.find(
          (articleTag) => articleTag === tag.id
        );
        if (articleTag) tag.selected = true;
      });
    });

    if (this.article && this.article() && this.article()?.id) {
      this.title = this.article()!.title;
      this.titleField =
        this.article()!.title[this.langSwitcherService.editorLang()];
      this.content = this.article()!.content;
      this.contentField =
        this.article()!.content[this.langSwitcherService.editorLang()];
      this.pageHeroPath = this.article()!.img.pageHero;
      this.published = this.article()!.published;
      this.author = this.article()!.author;
      this.date = new Date(this.article()!.date).toISOString().split('T')[0];
      this.articleService.articleId.set(this.article()!.id!);
      this.articleService.editorImages = this.article()!.img.editorImages || [];
    }
  }

  uploadEditorImage(file: File) {
    const id = this.articleService.articleId();
    if (!id) return throwError(() => new Error('Article ID not found'));
    return this.articleService.uploadImageEditor(id, file);
  }

  onTitleFieldChange() {
    this.title[this.langSwitcherService.editorLang()] = this.titleField;
  }

  onContentFieldChange() {
    this.content[this.langSwitcherService.editorLang()] = this.contentField;
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
    if (!id) return;
    this.articleService.saveArticle({
      articleId: id,
      title: this.title,
      content: this.content,
      pageHeroPath: this.pageHeroPath,
      published: this.published,
      author: this.author,
      date: new Date(this.date),
      tags: this.tagsList()
        .filter((tag) => tag.selected)
        .map((tag) => tag.id),
    });
  }

  onCancel() {
    this.router.navigate(['../'], { state: { canLeave: true } });
  }

  onChangeEditorLang(e: Event) {
    this.article()!.title[this.langSwitcherService.editorLang()] =
      this.titleField;
    this.article()!.content[this.langSwitcherService.editorLang()] =
      this.contentField;

    const target = e.target as HTMLSelectElement;

    this.langSwitcherService.editorLang.set(target.value as LangList);

    this.titleField =
      this.article()!.title[this.langSwitcherService.editorLang()];
    this.contentField =
      this.article()!.content[this.langSwitcherService.editorLang()];
  }
}
