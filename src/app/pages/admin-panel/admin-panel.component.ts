import { Component } from '@angular/core';
import { HeaderComponent } from "../../layout/header/header.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {

}
