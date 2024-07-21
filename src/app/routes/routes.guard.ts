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
    component.articleService.articleImages.length > 0 ||
    component.articleService.editorImages.length > 0
  ) {
    if (
      window.confirm(
        'Do you really want to leave? You will lose the entered data.'
      )
    ) {
      const id = component.articleService.articleId();

      await Promise.all(
        component.articleService.articleImages.map((image) =>
          component.articleService.deleteImage(image)
        )
      );
      await Promise.all(
        component.articleService.editorImages.map((image) =>
          component.articleService.deleteImage(image)
        )
      );
      if (id) await component.articleService.deleteArticle(id);

      return true;
    } else {
      return false;
    }
  }
  return true;
};
