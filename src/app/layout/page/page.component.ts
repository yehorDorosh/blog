import { Component, input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { LangList } from '../../lang-switcher/lang-switcher.model';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  nodeId = input<string>();
  providedLangs = input<LangList[]>();
}
