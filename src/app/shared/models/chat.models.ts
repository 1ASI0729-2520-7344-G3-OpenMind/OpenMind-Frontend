export type Sender = 'user' | 'bot';
export interface Mensaje { id: string; from: Sender; text: string; ts: number; }
export interface Conversacion { id: string; titulo: string; mensajes: Mensaje[]; recomendaciones?: string[]; }
