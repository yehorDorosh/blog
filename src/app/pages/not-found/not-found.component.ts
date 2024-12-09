import { Component, OnInit, inject } from '@angular/core';
import { PageComponent } from '../../layout/page/page.component';
import { Meta, Title } from '@angular/platform-browser';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import metaTranslations from '../../../locale/meta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [PageComponent, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
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
