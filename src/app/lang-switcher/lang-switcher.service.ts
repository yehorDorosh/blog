import { Injectable, inject, signal, afterNextRender } from '@angular/core';
import { LangList } from './lang-switcher.model';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LangSwitcherService {
  lang = signal<LangList>('en');
  editorLang = signal<LangList>('en');
  langList: LangList[] = ['en', 'ru', 'uk'];
  setLang = () => {};

  private location = inject(Location);

  constructor() {
    afterNextRender(() => {
      this.setLang = () => {
        const lang = this.location
          .prepareExternalUrl('/')
          .replace(/\//g, '') as LangList;
        this.editorLang.set(lang);
        this.lang.set(lang);
      };
    });
  }

  changeLanguage(lang: string) {
    const currentUrl = window.location.pathname;
    const segments = currentUrl.split('/');
    segments[1] = lang;
    const newUrl = segments.join('/');
    window.location.href = newUrl;
  }
}
