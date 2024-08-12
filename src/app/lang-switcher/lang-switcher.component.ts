import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LangSwitcherService } from './lang-switcher.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss',
})
export class LangSwitcherComponent {
  router = inject(Router);
  langSwitcherService = inject(LangSwitcherService);

  changeLanguageHandler(lang: string) {
    this.langSwitcherService.changeLanguage(lang);
  }
}
