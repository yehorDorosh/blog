import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { uid } from 'uid';
import { RouterLink } from '@angular/router';
import translit from '../../utils/translit';

@Component({
  selector: 'app-table-of-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table-of-content.component.html',
  styleUrl: './table-of-content.component.scss',
})
export class TableOfContentComponent {
  private platformId = inject(PLATFORM_ID);
  public headers: {
    textContent: string;
    id: string;
  }[] = [];

  ngAfterContentInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const h2 = document.querySelectorAll('h2');

      h2.forEach((header) => {
        const id = translit(header.textContent || uid());
        header.id = id;
        this.headers.push({
          textContent: header.textContent || '',
          id,
        });
      });
    }
  }
}
