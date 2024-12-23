import { Component, inject, input, signal, computed } from '@angular/core';
import { UserService } from '../../user/user.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminToolsComponent } from '../../admin/admin-tools/admin-tools.component';
import { LangSwitcherComponent } from '../../lang-switcher/lang-switcher.component';
import { BurgerComponent } from '../../ui/burger/burger.component';
import { SiteLogoComponent } from '../../ui/site-logo/site-logo.component';
import { CloseButtonComponent } from '../../ui/close-button/close-button.component';
import { LangList } from '../../lang-switcher/lang-switcher.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    AdminToolsComponent,
    LangSwitcherComponent,
    BurgerComponent,
    SiteLogoComponent,
    CloseButtonComponent,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userService = inject(UserService);
  nodeId = input<string>();
  providedLangs = input<LangList[]>();
  openNavMenu = signal(false);

  timeToLogout = computed(() => {
    const totalMinutes = this.userService.timeToLogout();
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.floor((totalMinutes - minutes) * 60);
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  });

  onLogout() {
    this.userService.logout();
  }

  onOpenNavMenu() {
    this.openNavMenu.set(true);
  }

  onCloseNavMenu() {
    this.openNavMenu.set(false);
  }

  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
