import {
  Component,
  inject,
  signal,
  HostListener,
  input,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { LangSwitcherService } from './lang-switcher.service';
import { LangList } from './lang-switcher.model';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '../../express.tokens';
import { Request } from 'express';

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
  private platformId = inject(PLATFORM_ID);
  req = inject(REQUEST, { optional: true }) as Request;

  providedLangs = input<LangList[] | undefined>(
    this.langSwitcherService.langList
  );

  openSwitcher = signal(false);

  url = computed(() => {
    if (isPlatformBrowser(this.platformId)) {
      const path = window.location.pathname.split('/');
      path.splice(1, 1);
      return path.join('/');
    }
    return this.req?.url || '';
  });

  changeLanguageHandler(event: MouseEvent, lang: string) {
    event.preventDefault();
    this.langSwitcherService.changeLanguage(lang);
  }

  toggleSwitcherHandler() {
    this.openSwitcher.update((prev) => !prev);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('app-lang-switcher');
    if (!clickedInside) {
      this.openSwitcher.set(false);
    }
  }
}
