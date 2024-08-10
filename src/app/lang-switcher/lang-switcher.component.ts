import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss',
})
export class LangSwitcherComponent {
  router = inject(Router);

  changeLanguage(lang: string) {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');
    segments[1] = lang;
    const newUrl = segments.join('/');
    window.location.href = newUrl;
  }
}
