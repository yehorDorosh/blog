import { Component, OnInit, inject } from '@angular/core';
import { ArticleEditorComponent } from '../../blog/article-editor/article-editor.component';
import { ArticleService } from '../../blog/article.service';
import { PageComponent } from '../../layout/page/page.component';

@Component({
  selector: 'app-new-article-admin',
  standalone: true,
  imports: [ArticleEditorComponent, PageComponent],
  templateUrl: './new-article-admin.component.html',
  styleUrl: './new-article-admin.component.scss',
})
export class NewArticleAdminComponent implements OnInit {
  private articleService = inject(ArticleService);

  ngOnInit(): void {
    this.articleService.createEmptyArticle();
  }
}
