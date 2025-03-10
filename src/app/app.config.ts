import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './routes/app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
};
