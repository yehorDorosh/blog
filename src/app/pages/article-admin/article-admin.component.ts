import { Component, inject, input, computed } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { ArticleService } from '../../blog/article.service';
import { type BlogArticle } from '../../blog/blog.model';
import { Router } from '@angular/router';
import { ArticleEditorComponent } from '../../blog/article-editor/article-editor.component';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';

@Component({
  selector: 'app-article-admin',
  standalone: true,
  imports: [HeaderComponent, ArticleEditorComponent, SanitizeHtmlPipe],
  templateUrl: './article-admin.component.html',
  styleUrl: './article-admin.component.scss',
})
export class ArticleAdminComponent {
  router = inject(Router);
  articleService = inject(ArticleService);
  paramNodeId = input.required<string>();
  article = computed<BlogArticle | undefined>(() => {
    return this.articles().find((article) => article.id === this.paramNodeId());
  });
  articles = computed<BlogArticle[]>(() => {
    return this.articleService.articles();
  });
  articleImageList = computed<string[]>(() => {
    return this.articleService
      .articleImageList()
      .map((imgPath) => '/api/image/' + imgPath);
  });

  ngOnInit(): void {
    this.articleService.getArticles();
    this.articleService.getAricleImgs(this.paramNodeId());
  }

  onDeleteImageListItem(imagePath: string) {
    this.articleService.deleteImage(imagePath, this.paramNodeId());
  }
}
