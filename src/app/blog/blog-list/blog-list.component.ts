import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { type BlogArticleResponse, type BlogArticle } from '../blog.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  loading = signal(false);
  articles = signal<BlogArticle[]>([]);

  ngOnInit(): void {
    this.loading.set(true);
    const subscription = this.httpClient.get<BlogArticleResponse>(`${environment.realBaseApiUrl}/blog.json`).subscribe({
      next: (response) => {
        this.articles.set(Object.keys(response).map(id => {
          return { id, ...response[id] };
        }))
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.loading.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
