import { inject } from '@angular/core';
import { ArticleAdminComponent } from '../pages/article-admin/article-admin.component';
import { CanDeactivateFn, Router } from '@angular/router';

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
