import { Component, input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { LangList } from '../../lang-switcher/lang-switcher.model';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  nodeId = input<string>();
  providedLangs = input<LangList[]>();
}
