import {HttpClient} from "@angular/common/http"
import {Injectable, inject, signal} from "@angular/core"
import { environment } from '../../environments/environment';

export interface ChatMessage{
  id: string
  conversationId: string
  sender: 'CUSTOMER' | 'BOT'
  content: string
  sentAt?: string
}

export interface Conversation{
  id: string;
  customerId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({providedIn: 'root'})
export class ChatService {
  private http = inject(HttpClient);
  private api = `${environment.apiBase}/conversations`;
  messages = signal<ChatMessage[]>([]);
  conversation = signal<Conversation | null>(null);
  loading = signal(false);
  conversations = signal<Conversation[]>([]); // historial en memoria

  async initConversation(customerId: number): Promise<string> {
    const existing = await this.http.get<Conversation[]>(
      `${this.api}?customerId=${customerId}`
    ).toPromise();
    const activeConv = existing?.find(c => c.active) || existing?.[0];
    if (activeConv) {
      this.conversation.set(activeConv);
      await this.loadMessages(activeConv.id);
      return activeConv.id;
    }
    const newConv = await this.http.post<Conversation>(this.api, { customerId }).toPromise();
    this.conversation.set(newConv!);
    this.messages.set([]);
    return newConv!.id;
  }

  loadMessages(conversationId: string) {
    return this.http.get<ChatMessage[]>(`${this.api}/${conversationId}/messages`)
      .subscribe(msgs => this.messages.set(msgs));
  }

  async getConversationsByCustomer(customerId: number) {
    const list = await this.http.get<Conversation[]>(`${this.api}?customerId=${customerId}`).toPromise();
    this.conversations.set(list || []);
    return list || [];
  }

  async loadConversation(conversationId: string) {
    // Carga una conversación y sus mensajes
    const conv = await this.http.get<Conversation>(`${this.api}/${conversationId}`).toPromise();
    this.conversation.set(conv!);
    await this.loadMessages(conversationId);
  }

  sendMessage(text: string) {
    if (!text.trim() || this.loading()) return;
    const conv = this.conversation();
    if (!conv) return;
    const userMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      conversationId: conv.id,
      sender: 'CUSTOMER',
      content: text.trim(),
      sentAt: new Date().toISOString()
    };
    this.messages.update(m => [...m, userMsg]);
    this.loading.set(true);
    this.http.post<ChatMessage>(`${this.api}/${conv.id}/messages`, {
      sender: 'CUSTOMER',
      text: text.trim()
    }).subscribe({
      next: (botReply) => {
        const mappedBotReply: ChatMessage = {
          id: botReply.id,
          conversationId: botReply.conversationId,
          sender: botReply.sender,
          content: botReply.content,
          sentAt: botReply.sentAt
        };
        this.messages.update(msgs => [...msgs, mappedBotReply]);
        this.loading.set(false);
      },
      error: (err) => {
        this.messages.update(msgs => [...msgs, {
          id: 'error-' + Date.now(),
          conversationId: conv.id,
          sender: 'BOT',
          content: 'Error: No pude procesar tu mensaje. Inténtalo de nuevo.',
          sentAt: new Date().toISOString()
        }]);
        this.loading.set(false);
      }
    });
  }

  async startNewConversation(customerId: number) {
    const newConv = await this.http.post<Conversation>(this.api, { customerId }).toPromise();
    this.conversation.set(newConv!);
    this.messages.set([]);
  }
}
