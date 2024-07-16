import { Component } from '@angular/core';
import { HeaderComponent } from "../../layout/header/header.component";
import { CreateArticleComponent } from "../../blog/create-article/create-article.component";

@Component({
  selector: 'app-new-article-admin',
  standalone: true,
  imports: [HeaderComponent, CreateArticleComponent],
  templateUrl: './new-article-admin.component.html',
  styleUrl: './new-article-admin.component.scss'
})
export class NewArticleAdminComponent {

}
