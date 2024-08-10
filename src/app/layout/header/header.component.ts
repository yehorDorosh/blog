import { Component, inject, input } from '@angular/core';
import { UserService } from '../../user/user.service';
import { RouterLink } from '@angular/router';
import { AdminToolsComponent } from '../../admin/admin-tools/admin-tools.component';
import { LangSwitcherComponent } from '../../lang-switcher/lang-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AdminToolsComponent, LangSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userService = inject(UserService);
  paramNodeId = input<string>();

  onLogout() {
    this.userService.logout();
  }
}
