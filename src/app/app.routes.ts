import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/presentation/components/layout.component/layout.component';
import { Home } from './shared/presentation/views/home/home';
import {Profile} from './shared/presentation/views/profile/profile'
import {Login} from './shared/presentation/views/login/login'
import {Register} from './shared/presentation/views/register/register'

export const routes: Routes = [
  {
    path: '', component: Login
  },
  {
    path: 'register', component: Register
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: Home },
      {
        path: 'chatbot',
        loadChildren: () => import('./features/chatbot/routes').then(m => m.CHATBOT_ROUTES)
      },
      {
        path: 'recom',
        loadChildren: () => import('./features/recom/routes').then(m => m.RECOM_ROUTES)
      },
      {
        path: 'profile', component: Profile
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ]
  },

];
