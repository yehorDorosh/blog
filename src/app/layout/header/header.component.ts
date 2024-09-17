import { Component, inject, input, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { UserService } from '../../user/user.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminToolsComponent } from '../../admin/admin-tools/admin-tools.component';
import { LangSwitcherComponent } from '../../lang-switcher/lang-switcher.component';
import { BurgerComponent } from '../../ui/burger/burger.component';
import { SiteLogoComponent } from '../../ui/site-logo/site-logo.component';
import { CloseButtonComponent } from '../../ui/close-button/close-button.component';

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
    NgIf,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userService = inject(UserService);
  paramNodeId = input<string>();
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
