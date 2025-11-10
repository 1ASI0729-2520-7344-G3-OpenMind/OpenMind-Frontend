import { Injectable } from '@angular/core';
import { ChatRepository } from '../../chatbot/data/chat.repository';
import { Conversacion } from '../../../shared/models/chat.models';

export interface Recomendacion {
  id: string;
  titulo: string;
  tipo: 'psicologo' | 'terapeuta' | 'linea-ayuda' | 'recurso';
  detalle: string;
}

@Injectable({ providedIn: 'root' })
export class RecomRepository {
  constructor(private chat: ChatRepository) {}

  private uuid(): string {
    return (globalThis.crypto && 'randomUUID' in globalThis.crypto)
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  }

  /**
   * Genera recomendaciones a partir del texto de la conversación actual.
   * arreglos y reglas simples (palabras clave).
   */
  getRecomendaciones(): Recomendacion[] {
    // Tomar la conversación abierta (si no hay, devolver recomendaciones base)
    const current: Conversacion | undefined = this.chat.getConversacionActual();

    // Recs base (siempre aparecen)
    const recs: Recomendacion[] = [
      { id: this.uuid(), titulo: 'Guía de respiración 4-7-8', tipo: 'recurso', detalle: 'Paso a paso en 1 minuto' },
      { id: this.uuid(), titulo: 'Rutina de higiene del sueño', tipo: 'recurso', detalle: '15 minutos antes de dormir' }
    ];

    if (!current || !current.mensajes?.length) {
      recs.push(
        { id: this.uuid(), titulo: 'Psicólogo – Consulta general', tipo: 'psicologo', detalle: 'psicologia@openmind.pe' },
        { id: this.uuid(), titulo: 'Línea de apoyo 24/7', tipo: 'linea-ayuda', detalle: '0800-00-000 (gratuito)' }
      );
      return recs;
    }

    const texto = current.mensajes.map(m => (m.text || '').toLowerCase()).join(' ');

    const has = (...k: string[]) => k.some(t => texto.includes(t));

    if (has('ansiedad', 'ansiosa', 'ansioso', 'estrés', 'estres', 'nervios')) {
      recs.push(
        { id: this.uuid(), titulo: 'Terapeuta – Manejo de ansiedad', tipo: 'terapeuta', detalle: 'respira@openmind.pe' },
        { id: this.uuid(), titulo: 'Mindfulness básico (7 días)', tipo: 'recurso', detalle: 'Programa guiado nivel 1' }
      );
    }

    if (has('triste', 'depre', 'depres', 'bajonead', 'desanimado', 'desanimada')) {
      recs.push(
        { id: this.uuid(), titulo: 'Psicólogo – Estado de ánimo', tipo: 'psicologo', detalle: 'animo@openmind.pe' },
        { id: this.uuid(), titulo: 'Diario de emociones (plantilla)', tipo: 'recurso', detalle: '3 preguntas cada noche' }
      );
    }

    if (has('ayuda', 'profesional', 'terapia', 'terapeuta', 'psicolog')) {
      recs.push(
        { id: this.uuid(), titulo: 'Primera sesión de orientación', tipo: 'psicologo', detalle: 'agenda@openmind.pe' },
        { id: this.uuid(), titulo: 'Línea de apoyo 24/7', tipo: 'linea-ayuda', detalle: '0800-00-000 (gratuito)' }
      );
    }

    return recs;
  }
}
