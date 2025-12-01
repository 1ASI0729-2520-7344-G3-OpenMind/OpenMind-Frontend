import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatService, Conversation } from '../../../../services/chat.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatListModule, MatIconModule, MatButtonModule,
    MatCardModule, MatDividerModule, MatTooltipModule
  ],
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy {
  history: Conversation[] = [];
  loading = false;
  private navSub?: Subscription;

  constructor(private chat: ChatService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.load();
    this.navSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url.endsWith('/chatbot/history')) {
        this.load();
      }
    });
  }
  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }
  async load() {
    const uid = this.auth.getCustomerId();
    if (!uid) return;
    this.loading = true;
    this.history = [];
    const result = await this.chat.getConversationsByCustomer(uid);
    this.history = [...result];
    console.log('[HIST] Historial recibido:', this.history, 'length', this.history.length);
    this.loading = false;
  }
  async open(id: string) {
    await this.chat.loadConversation(id);
    this.router.navigateByUrl('/chatbot');
  }
  goToHistory() {
    this.router.navigateByUrl('/home').then(() => {
      this.router.navigateByUrl('/chatbot/history');
    });
  }
}
