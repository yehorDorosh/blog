import { Injectable, inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { REQUEST, RESPONSE } from '../../express.tokens';
import { Request, Response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  private document: Document = inject(DOCUMENT);
  private req: Request =
    (inject(REQUEST, { optional: true }) as Request) || null;
  private res: Response =
    (inject(RESPONSE, { optional: true }) as Response) || null;
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);

  constructor() {
    const path = this.req?.originalUrl ? this.req.originalUrl : '/';
    const host = this.req?.hostname
      ? this.req.hostname.replace('www', '')
      : 'waves-and-mountains.blog';

    let link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(link);
    if (path === '/') {
      link.setAttribute('href', `https://${host}${path}en`);
    } else {
      link.setAttribute('href', `https://${host}${path}`);
    }
  }
}
