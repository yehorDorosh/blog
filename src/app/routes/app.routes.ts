import { Routes, CanDeactivateFn } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { ArticleComponent } from '../pages/article/article.component';
import { AuthComponent } from '../pages/auth/auth.component';
import { AdminPanelComponent } from '../pages/admin-panel/admin-panel.component';
import { NewArticleAdminComponent } from '../pages/new-article-admin/new-article-admin.component';
import { ArticleAdminComponent } from '../pages/article-admin/article-admin.component';
import { canDeactivateFnEditor, isLogedInFn } from './routes.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'blog/:paramArticleId',
    component: ArticleComponent,
  },
  {
    path: 'user',
    component: AuthComponent,
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [isLogedInFn],
  },
  {
    path: 'admin/new-article',
    component: NewArticleAdminComponent,
    canDeactivate: [canDeactivateFnEditor],
    canActivate: [isLogedInFn],
  },
  {
    path: 'admin/node/:paramNodeId',
    component: ArticleAdminComponent,
    canDeactivate: [canDeactivateFnEditor],
    canActivate: [isLogedInFn],
  },
];
