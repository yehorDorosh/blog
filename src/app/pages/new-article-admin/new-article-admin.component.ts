import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { ArticleEditorComponent } from '../../blog/article-editor/article-editor.component';
import { ArticleService } from '../../blog/article.service';

@Component({
  selector: 'app-new-article-admin',
  standalone: true,
  imports: [HeaderComponent, ArticleEditorComponent],
  templateUrl: './new-article-admin.component.html',
  styleUrl: './new-article-admin.component.scss',
})
export class NewArticleAdminComponent implements OnInit {
  private articleService = inject(ArticleService);

  ngOnInit(): void {
    this.articleService.createEmptyArticle();
  }
}
