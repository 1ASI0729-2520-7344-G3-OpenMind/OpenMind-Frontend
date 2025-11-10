import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ChatRepository } from '../../data/chat.repository';
import { Conversacion } from '../../../../shared/models/chat.models';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDividerModule,
    MatChipsModule, MatTooltipModule
  ],
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnDestroy {
  convo?: Conversacion;
  input = '';
  titulo = 'Nueva conversación';
  sub: Subscription;

  constructor(private repo: ChatRepository) {
    this.sub = this.repo.current$.subscribe(c => {
      this.convo = c;
      if (c?.titulo) this.titulo = c.titulo;
    });
  }

  send() {
    const text = this.input.trim();
    if (!text) return;
    this.repo.enviarMensajeUsuario(text);
    this.input = '';
  }

  save() {
    const name = this.titulo?.trim() || 'Conversación';
    this.repo.guardarConversacion(name);
  }

  new() {
    this.repo.nuevaConversacion('Nueva conversación');
    this.input = '';
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
