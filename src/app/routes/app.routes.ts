import { Routes, CanDeactivateFn } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { ArticleComponent } from '../pages/article/article.component';
import { AuthComponent } from '../pages/auth/auth.component';
import { AdminPanelComponent } from '../pages/admin-panel/admin-panel.component';
import { NewArticleAdminComponent } from '../pages/new-article-admin/new-article-admin.component';
import { ArticleAdminComponent } from '../pages/article-admin/article-admin.component';
import {
  canDeactivateFnEditor,
  isLogedInFn,
  isArticlePathExist,
} from './routes.guard';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { Redirect404Component } from './redirect-404/redirect-404.component';
import redirectRoutes from './redirect';

export const routes: Routes = [
  ...redirectRoutes,
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'blog/:paramArticleId',
    component: ArticleComponent,
    canActivate: [isArticlePathExist],
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
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: Redirect404Component,
  },
];
