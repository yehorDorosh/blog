import { Component, OnInit, inject } from '@angular/core';
import { ArticlePreviewComponent } from './article-preview/article-preview.component';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [ArticlePreviewComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit {
  articleService = inject(ArticleService);

  ngOnInit(): void {
    this.articleService.getArticles();
  }

}
