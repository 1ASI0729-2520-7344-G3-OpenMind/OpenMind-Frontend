import { Routes } from '@angular/router';
export const CHATBOT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/chat-page/chat-page.component').then(m => m.ChatPageComponent) },
  { path: 'history', loadComponent: () => import('./pages/history-page/history-page.component').then(m => m.HistoryPageComponent) }
];
