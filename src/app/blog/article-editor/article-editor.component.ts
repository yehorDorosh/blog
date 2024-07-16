import { Component, inject, input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ArticleService } from '../article.service';
import { Validators } from '@angular/forms';
import { BlogArticle } from '../blog.model';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss'
})
export class ArticleEditorComponent implements OnInit {
  private articleService = inject(ArticleService);

  article = input.required<BlogArticle>();

  form = new FormGroup({
    title: new FormControl('', { 
      validators: [Validators.required],
     }),
    content: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.form.patchValue({
      title: this.article().title,
      content: this.article().content,
    });
  }

  onFileSelected(event: Event) {}

  onSubmit() {
    console.log(this.form.value);
  }
}
