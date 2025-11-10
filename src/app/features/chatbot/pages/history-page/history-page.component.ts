import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ChatRepository } from '../../data/chat.repository';
import { Conversacion } from '../../../../shared/models/chat.models';

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
export class HistoryPageComponent {
  history: Conversacion[] = [];

  constructor(private repo: ChatRepository, private router: Router) {
    this.history = this.repo.getHistory();
  }

  open(id: string) {
    this.repo.abrirConversacion(id);
    this.router.navigateByUrl('/chatbot');
  }

  remove(id: string) {
    if (!confirm('¿Eliminar conversación?')) return;
    this.repo.eliminarConversacion(id);
    this.history = this.repo.getHistory();
  }
}
