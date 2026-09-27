import { LangList } from '../lang-switcher/lang-switcher.model';

type ConsentTextKey =
  | 'title'
  | 'description'
  | 'acceptAll'
  | 'rejectAll'
  | 'manage'
  | 'save'
  | 'close'
  | 'preferencesTitle'
  | 'preferencesDescription'
  | 'necessaryTitle'
  | 'necessaryDescription'
  | 'mediaTitle'
  | 'mediaDescription'
  | 'placeholder'
  | 'placeholderBtn'
  | 'settingsLink';

export type ConsentTexts = Record<ConsentTextKey, string>;

export const consentTranslations: Record<LangList, ConsentTexts> = {
  en: {
    title: 'We use cookies',
    description:
      'Some articles contain embedded YouTube videos and Google Maps. These services set their own cookies. They are loaded only with your consent.',
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    manage: 'Manage preferences',
    save: 'Save preferences',
    close: 'Close',
    preferencesTitle: 'Cookie preferences',
    preferencesDescription:
      'Choose which third-party content may be loaded. You can change your choice at any time via the "Cookie settings" link at the bottom of the page.',
    necessaryTitle: 'Strictly necessary',
    necessaryDescription:
      'Required for the site to work. This site itself does not set tracking cookies.',
    mediaTitle: 'Embedded media',
    mediaDescription:
      'YouTube videos and Google Maps inside articles. When enabled, Google may set cookies and receive your IP address.',
    placeholder:
      'This content is hosted by a third party (YouTube / Google Maps) that may set cookies.',
    placeholderBtn: 'Load content',
    settingsLink: 'Cookie settings',
  },
  ru: {
    title: 'Мы используем cookies',
    description:
      'В некоторых статьях есть встроенные видео YouTube и карты Google. Эти сервисы ставят собственные cookies и загружаются только с вашего согласия.',
    acceptAll: 'Принять все',
    rejectAll: 'Отклонить все',
    manage: 'Настроить',
    save: 'Сохранить',
    close: 'Закрыть',
    preferencesTitle: 'Настройки cookies',
    preferencesDescription:
      'Выберите, какой сторонний контент можно загружать. Изменить выбор можно в любой момент по ссылке «Настройки cookies» внизу страницы.',
    necessaryTitle: 'Необходимые',
    necessaryDescription:
      'Нужны для работы сайта. Сам сайт не ставит отслеживающих cookies.',
    mediaTitle: 'Встроенные медиа',
    mediaDescription:
      'Видео YouTube и карты Google в статьях. Если включить, Google может установить cookies и получить ваш IP-адрес.',
    placeholder:
      'Этот контент размещён на стороннем сервисе (YouTube / Google Maps), который может установить cookies.',
    placeholderBtn: 'Загрузить',
    settingsLink: 'Настройки cookies',
  },
  uk: {
    title: 'Ми використовуємо cookies',
    description:
      'У деяких статтях є вбудовані відео YouTube та карти Google. Ці сервіси встановлюють власні cookies і завантажуються лише з вашої згоди.',
    acceptAll: 'Прийняти всі',
    rejectAll: 'Відхилити всі',
    manage: 'Налаштувати',
    save: 'Зберегти',
    close: 'Закрити',
    preferencesTitle: 'Налаштування cookies',
    preferencesDescription:
      'Оберіть, який сторонній контент можна завантажувати. Змінити вибір можна будь-коли за посиланням «Налаштування cookies» внизу сторінки.',
    necessaryTitle: 'Необхідні',
    necessaryDescription:
      'Потрібні для роботи сайту. Сам сайт не встановлює відстежувальних cookies.',
    mediaTitle: 'Вбудовані медіа',
    mediaDescription:
      'Відео YouTube та карти Google у статтях. Якщо увімкнути, Google може встановити cookies і отримати вашу IP-адресу.',
    placeholder:
      'Цей контент розміщено на сторонньому сервісі (YouTube / Google Maps), який може встановити cookies.',
    placeholderBtn: 'Завантажити',
    settingsLink: 'Налаштування cookies',
  },
};
