import { Component, inject, input, computed } from '@angular/core';
import { ArticleService } from '../../blog/article.service';
import { type BlogArticle } from '../../blog/blog.model';
import { Router } from '@angular/router';
import { ArticleEditorComponent } from '../../blog/article-editor/article-editor.component';
import { PageComponent } from '../../layout/page/page.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-article-admin',
  standalone: true,
  imports: [ArticleEditorComponent, PageComponent],
  templateUrl: './article-admin.component.html',
  styleUrl: './article-admin.component.scss',
})
export class ArticleAdminComponent {
  router = inject(Router);
  articleService = inject(ArticleService);
  meta = inject(Meta);
  title = inject(Title);

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
      .map((imgPath) => `/api/image/${imgPath}`);
  });

  ngOnInit(): void {
    this.articleService.getArticles();
    this.articleService.getAricleImgs(this.paramNodeId());
    this.title.setTitle('Article editor');
    this.meta.addTag({ name: 'description', content: 'Article editor' });
  }

  onDeleteImageListItem(imagePath: string) {
    this.articleService.deleteImage(imagePath, this.paramNodeId());
  }
}
