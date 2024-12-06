import { Component, OnInit, inject } from '@angular/core';
import { ArticleEditorComponent } from '../../blog/article-editor/article-editor.component';
import { ArticleService } from '../../blog/article.service';
import { PageComponent } from '../../layout/page/page.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-article-admin',
  standalone: true,
  imports: [ArticleEditorComponent, PageComponent],
  templateUrl: './new-article-admin.component.html',
  styleUrl: './new-article-admin.component.scss',
})
export class NewArticleAdminComponent implements OnInit {
  private articleService = inject(ArticleService);
  private meta = inject(Meta);
  private title = inject(Title);

  ngOnInit(): void {
    this.articleService.createEmptyArticle();
    this.title.setTitle('Create new Article');
    this.meta.addTag({ name: 'description', content: 'Create new Article' });
  }
}
