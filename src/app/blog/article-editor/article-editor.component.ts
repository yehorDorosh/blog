import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../article.service';
import { BlogArticle } from '../blog.model';

import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [FormsModule, HttpClientModule, AngularEditorModule],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss',
})
export class ArticleEditorComponent implements OnInit {
  private articleService = inject(ArticleService);

  article = input<BlogArticle>();

  title = '';
  content = '';
  pageHeroFileName = '';

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

  ngOnInit() {}

  uploadEditorImage(file: File) {
    const id = this.articleService.articleId();
    if (!id) return throwError(() => new Error('Article ID not found'));
    return this.articleService.uploadImageEditor(id, file);
  }

  onPageHeroSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const id = this.articleService.articleId();
    if (input.files && input.files.length > 0 && id) {
      this.pageHeroFileName = input.files[0].name;
      this.articleService.uploadImage(id, input.files[0]);
    }
  }

  onSubmit() {
    const id = this.articleService.articleId();
    if (!id) return;
    this.articleService.saveArticle(
      id,
      this.title,
      this.content,
      this.pageHeroFileName
    );
  }

  onCancel() {
    const id = this.articleService.articleId();
    if (this.pageHeroFileName)
      this.articleService.deleteImage(
        `/api/image/${id}/${this.pageHeroFileName}`
      );
    this.articleService.editorImages.forEach((image) => {
      this.articleService.deleteImage(image);
    });
    if (id) this.articleService.deleteArticle(id);
  }
}
