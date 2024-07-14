import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent {
  private selectedFile: File | null = null;
  private articleService = inject(ArticleService);

  form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    this.articleService.createArticle({
      title: this.form.get('title')!.value!,
      content: this.form.get('content')!.value!,
      pageheroImg: this.selectedFile!,
    });
  }
}
