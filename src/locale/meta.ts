import { type TranslatableContent } from '../app/blog/blog.model';

type Pages = 'home' | 'article';
type MetaKeys = 'title' | 'description';

const metaTranslations: {
  [key in Pages]: {
    [key in MetaKeys]: TranslatableContent;
  };
} = {
  home: {
    title: {
      en: 'Montenegro & Portugal life blog',
      ru: 'Блог о жизни в Черногории и Португалии',
      uk: 'Блог про життя в Чорногорії та Португалії',
    },
    description: {
      en: 'This site about life in Montenegro and Portual. All about travaling.',
      ru: 'Этот сайт о жизни в Черногории и Португалии. Все о путешествиях.',
      uk: 'Цей сайт про життя в Чорногорії та Португалії. Все про подорожі.',
    },
  },
  article: {
    title: {
      en: 'Article',
      ru: 'Статья',
      uk: 'Стаття',
    },
    description: {
      en: 'Article',
      ru: 'Статья',
      uk: 'Стаття',
    },
  },
};

export default metaTranslations;
