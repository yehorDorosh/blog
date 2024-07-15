import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticleComponent } from './pages/article/article.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [{
    path: '',
    component: HomeComponent
}, {
    path: 'blog/:paramArticleId',
    component: ArticleComponent
}, {
    path: 'user',
    component: AuthComponent
}];
