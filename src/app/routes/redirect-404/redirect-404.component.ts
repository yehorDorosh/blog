import { Component, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import { NotFoundComponent } from '../../pages/not-found/not-found.component';

@Component({
  selector: 'app-redirect-404',
  standalone: true,
  imports: [NotFoundComponent],
  templateUrl: './redirect-404.component.html',
  styleUrl: './redirect-404.component.scss',
})
export class Redirect404Component implements OnInit {
  langSwitcherService = inject(LangSwitcherService);
  platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `/${this.langSwitcherService.lang()}/404`;
    }
  }
}
