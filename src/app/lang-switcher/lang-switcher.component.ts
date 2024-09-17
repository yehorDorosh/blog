import { Component, inject, signal, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LangSwitcherService } from './lang-switcher.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [NgFor],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss',
})
export class LangSwitcherComponent {
  router = inject(Router);
  langSwitcherService = inject(LangSwitcherService);
  openSwitcher = signal(false);

  changeLanguageHandler(lang: string) {
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
