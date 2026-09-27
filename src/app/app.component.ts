import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { LangSwitcherService } from './lang-switcher/lang-switcher.service';
import { filter } from 'rxjs/operators';
import { CookieConsentService } from './cookie-consent/cookie-consent.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  router = inject(Router);
  langSwitcherService = inject(LangSwitcherService);
  // injected here so the consent banner is initialised on every page
  cookieConsent = inject(CookieConsentService);

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.langSwitcherService.setLang();
      });
  }
}
