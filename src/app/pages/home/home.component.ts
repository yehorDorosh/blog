import { Component, inject, OnInit } from '@angular/core';
import { BlogListComponent } from '../../blog/blog-list/blog-list.component';
import { PageComponent } from '../../layout/page/page.component';
import { RotorBannerComponent } from './rotor-banner/rotor-banner.component';
import { Meta, Title } from '@angular/platform-browser';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import metaTranslations from '../../../locale/meta';
import { PagesService } from '../pages.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BlogListComponent, PageComponent, RotorBannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private meta = inject(Meta);
  private title = inject(Title);
  private pageService = inject(PagesService);
  langSwitcherService = inject(LangSwitcherService);

  ngOnInit() {
    const lang = this.langSwitcherService.lang();
    this.title.setTitle(metaTranslations.home.title[lang]);
    this.meta.addTag({
      name: 'description',
      content: metaTranslations.home.description[lang],
    });
    this.meta.addTag({
      property: 'og:image',
      content:
        'https://waves-and-mountains.blog/assets/images/opengraph/DJI_0041.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: 'https://waves-and-mountains.blog/',
    });
    this.meta.addTag({
      property: 'og:type',
      content: 'website',
    });
  }
}
