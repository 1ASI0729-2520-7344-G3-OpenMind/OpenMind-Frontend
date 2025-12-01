import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ChatService } from '../../../../services/chat.service';
import { AuthService } from '../../../../core/services/auth.service';

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
export class ChatComponent implements OnInit, AfterViewChecked {
  chatService = inject(ChatService);
  auth = inject(AuthService);

  messages = this.chatService.messages.asReadonly();
  loading = this.chatService.loading.asReadonly();
  newMessage = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngOnInit(): void {
    const customerId = this.auth.getCustomerId();
    if (!customerId) {
      console.error('Usuario no autenticado');
      return;
    }
    this.chatService.initConversation(customerId);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  send(): void {
    if (!this.newMessage.trim() || this.loading()) return;
    const msg = this.newMessage.trim();
    this.newMessage = '';
    this.chatService.sendMessage(msg);
  }

  async newConversation(): Promise<void> {
    const customerId = this.auth.getCustomerId();
    if (customerId) {
      await this.chatService.startNewConversation(customerId);
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
