import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { RouterLink } from '@angular/router';
import { BlogListComponent } from '../../blog/blog-list/blog-list.component';
import { TagsManagerComponent } from '../../admin/tags-manager/tags-manager.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    BlogListComponent,
    TagsManagerComponent,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent {}
