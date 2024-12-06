import { Component, inject, OnInit } from '@angular/core';
import { BlogListComponent } from '../../blog/blog-list/blog-list.component';
import { PageComponent } from '../../layout/page/page.component';
import { RotorBannerComponent } from './rotor-banner/rotor-banner.component';
import { Meta, Title } from '@angular/platform-browser';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import metaTranslations from '../../../locale/meta';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BlogListComponent, PageComponent, RotorBannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  meta = inject(Meta);
  title = inject(Title);
  langSwitcherService = inject(LangSwitcherService);

  ngOnInit() {
    const lang = this.langSwitcherService.lang();
    this.title.setTitle(metaTranslations.home.title[lang]);
    this.meta.addTag({
      name: 'description',
      content: metaTranslations.home.description[lang],
    });
  }
}
