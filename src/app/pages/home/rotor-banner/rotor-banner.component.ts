import { Component, Inject, PLATFORM_ID } from '@angular/core';
import Splide from '@splidejs/splide';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-rotor-banner',
  standalone: true,
  imports: [],
  templateUrl: './rotor-banner.component.html',
  styleUrl: './rotor-banner.component.scss',
})
export class RotorBannerComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      new Splide('.splide', {
        type: 'fade',
        rewind: true,
        autoplay: true,
        interval: 5000,
        pauseOnHover: false,
      }).mount();
    }
  }
}
