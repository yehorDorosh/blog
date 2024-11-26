import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogListComponent } from '../../blog/blog-list/blog-list.component';
import { TagsManagerComponent } from '../../admin/tags-manager/tags-manager.component';
import { PageComponent } from '../../layout/page/page.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink, BlogListComponent, TagsManagerComponent, PageComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent {}
