import { Component } from '@angular/core';
import { BlogListComponent } from "../../blog/blog-list/blog-list.component";
import { HeaderComponent } from "../../layout/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BlogListComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
}
