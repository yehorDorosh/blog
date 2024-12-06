import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogListComponent } from '../../blog/blog-list/blog-list.component';
import { TagsManagerComponent } from '../../admin/tags-manager/tags-manager.component';
import { PageComponent } from '../../layout/page/page.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink, BlogListComponent, TagsManagerComponent, PageComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnInit {
  meta = inject(Meta);
  title = inject(Title);

  ngOnInit() {
    this.title.setTitle('Admin Panel');
    this.meta.addTag({ name: 'description', content: 'Admin Panel' });
  }
}
