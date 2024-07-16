import { Component, inject } from '@angular/core';
import { CreateArticleComponent } from "../../blog/create-article/create-article.component";
import { BlogListComponent } from "../../blog/blog-list/blog-list.component";
import { HeaderComponent } from "../../layout/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CreateArticleComponent, BlogListComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
}
