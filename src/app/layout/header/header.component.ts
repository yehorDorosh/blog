import { Component, inject } from '@angular/core';
import { UserService } from "../../user/user.service";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userService = inject(UserService);

  onLogout() {
    this.userService.logout();
  }
}
