import { Component } from '@angular/core';
import { BlogListComponent } from '../../blog/blog-list/blog-list.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { PageComponent } from '../../layout/page/page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BlogListComponent, HeaderComponent, PageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
