import { Component } from '@angular/core';
import { BlogListComponent } from '../../blog/blog-list/blog-list.component';
import { PageComponent } from '../../layout/page/page.component';
import { RotorBannerComponent } from './rotor-banner/rotor-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BlogListComponent, PageComponent, RotorBannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
