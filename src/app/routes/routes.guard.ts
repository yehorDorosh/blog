import { inject } from '@angular/core';
import { ArticleAdminComponent } from '../pages/article-admin/article-admin.component';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { ArticleService } from '../blog/article.service';

export const canDeactivateFnEditor: CanDeactivateFn<
  ArticleAdminComponent
> = async (component) => {
  const router = inject(Router);
  const currentNavigation = router.getCurrentNavigation();
  const state = currentNavigation?.extras.state;

  if (state && state['canLeave']) return true;

  if (
    component.articleService.editorImages.length > 0 ||
    component.articleService.articleImages.length > 0
  ) {
    if (
      window.confirm(
        'Do you really want to leave? You will lose the entered data.'
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

export const isLogedInFn: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);

  if (userService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/'], { replaceUrl: true });
    return false;
  }
};

export const isArticlePathExist: CanActivateFn = (_, state) => {
  const articleService = inject(ArticleService);
  const router = inject(Router);
  const currentPath = state.url;
  const articleURL = currentPath.split('/').at(-1);
  const articles = articleService.articles();
  const article = articles.find((article) => article.url === articleURL);

  if (article) {
    return true;
  } else {
    router.navigate(['404'], { replaceUrl: true });
    return false;
  }
};
