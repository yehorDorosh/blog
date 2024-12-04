import { Component, inject, input, signal } from '@angular/core';
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

  onLogout() {
    this.userService.logout();
  }

  onOpenNavMenu() {
    this.openNavMenu.set(true);
  }

  onCloseNavMenu() {
    this.openNavMenu.set(false);
  }
}
