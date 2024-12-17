import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { uid } from 'uid';
import { RouterLink } from '@angular/router';
import translit from '../../utils/translit';
import { type Header } from './table-of-content.model';

@Component({
  selector: 'app-table-of-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table-of-content.component.html',
  styleUrl: './table-of-content.component.scss',
})
export class TableOfContentComponent {
  private platformId = inject(PLATFORM_ID);
  public headers: Header[] = [];

  ngAfterContentInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const h2 = document.querySelectorAll('h2');

      h2.forEach((header) => {
        const id = translit(header.textContent || uid());
        header.id = id;
        this.headers.push({
          textContent: header.textContent || '',
          id,
          headers: this.getSubTitles(header, 'H3').map((h3) => {
            const id = translit(h3.textContent || uid());
            h3.id = id;
            return {
              textContent: h3.textContent || '',
              id,
              headers: this.getSubTitles(h3, 'H4').map((h4) => {
                const id = translit(h4.textContent || uid());
                h4.id = id;
                return {
                  textContent: h4.textContent || '',
                  id,
                };
              }),
            };
          }),
        });
      });
    }
  }

  getSubTitles(target: Element, tagName: string) {
    const headings = [];
    let sibling = target.nextElementSibling;
    while (sibling) {
      if (sibling.tagName === target.tagName) break;
      if (sibling.tagName === tagName) headings.push(sibling);
      sibling = sibling.nextElementSibling;
    }

    return headings;
  }
}
