import { Component, inject } from '@angular/core';
import { CookieConsentService } from '../../cookie-consent/cookie-consent.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  cookieConsent = inject(CookieConsentService);
}
