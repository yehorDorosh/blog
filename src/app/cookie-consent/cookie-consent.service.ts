import {
  Injectable,
  LOCALE_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { LangList } from '../lang-switcher/lang-switcher.model';
import { consentTranslations } from './cookie-consent.translations';

export const MEDIA_CATEGORY = 'media';

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  mediaAllowed = signal(false);

  private lang = (inject(LOCALE_ID, { optional: true }) || 'en') as LangList;
  // the library touches window/document on import, so it is loaded lazily in the browser only
  private cc?: typeof import('vanilla-cookieconsent');

  constructor() {
    afterNextRender(() => {
      this.init();
    });
  }

  get texts() {
    return consentTranslations[this.lang] ?? consentTranslations.en;
  }

  acceptMedia() {
    this.cc?.acceptCategory([...this.acceptedCategories(), MEDIA_CATEGORY]);
    this.mediaAllowed.set(true);
  }

  showPreferences() {
    this.cc?.showPreferences();
  }

  private acceptedCategories(): string[] {
    return this.cc?.getUserPreferences().acceptedCategories ?? [];
  }

  private async init() {
    this.cc = await import('vanilla-cookieconsent');
    const sync = () =>
      this.mediaAllowed.set(this.cc!.acceptedCategory(MEDIA_CATEGORY));
    const t = this.texts;

    await this.cc.run({
      guiOptions: {
        consentModal: { layout: 'box', position: 'bottom left' },
        preferencesModal: { layout: 'box' },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        [MEDIA_CATEGORY]: {},
      },
      onConsent: sync,
      onChange: sync,
      language: {
        default: this.lang,
        translations: {
          [this.lang]: {
            consentModal: {
              title: t.title,
              description: t.description,
              acceptAllBtn: t.acceptAll,
              acceptNecessaryBtn: t.rejectAll,
              showPreferencesBtn: t.manage,
            },
            preferencesModal: {
              title: t.preferencesTitle,
              acceptAllBtn: t.acceptAll,
              acceptNecessaryBtn: t.rejectAll,
              savePreferencesBtn: t.save,
              closeIconLabel: t.close,
              sections: [
                { description: t.preferencesDescription },
                {
                  title: t.necessaryTitle,
                  description: t.necessaryDescription,
                  linkedCategory: 'necessary',
                },
                {
                  title: t.mediaTitle,
                  description: t.mediaDescription,
                  linkedCategory: MEDIA_CATEGORY,
                },
              ],
            },
          },
        },
      },
    });

    sync();
  }
}
