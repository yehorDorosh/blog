import { Injectable, inject, signal } from '@angular/core';
import { LangList } from './lang-switcher.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LangSwitcherService {
  private lang: LangList = 'en';
  editorLang = signal<LangList>('en');
  langList: LangList[] = ['en', 'ru', 'uk'];

  private router = inject(Router);

  setLang() {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');
    this.lang = segments[1] as LangList;
  }

  getLang() {
    return this.lang;
  }

  changeLanguage(lang: string) {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');
    segments[1] = lang;
    const newUrl = segments.join('/');
    window.location.href = newUrl;
  }
}
