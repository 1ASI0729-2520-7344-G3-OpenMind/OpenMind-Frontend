import { Injectable } from '@angular/core';

import { LlmAdapter } from './llm.adapter';
@Injectable({ providedIn: 'root' })
export class LocalLlmService implements LlmAdapter {
  async generate(userText: string): Promise<string> {
    const t = (userText || '').toLowerCase();
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    await wait(600 + Math.random() * 700);

    const has = (...k: string[]) => k.some(x => t.includes(x));

    if (has('ansiedad', 'estrés', 'estres', 'nervios')) {
      return 'Veo señales de ansiedad/estrés. • 4-7-8 x4 • Escribe 3 preocupaciones y 1 micro-acción • Camina 10–15 min. ¿Cuándo aparece más?';
    }

    if (has('triste', 'depre', 'depres', 'bajonead')) {
      return 'Siento que te sientas así. • Diario 3 líneas • Habla 5–10 min con alguien • Toma agua y busca luz natural. ¿Qué 1% mejoraría ahora?';
    }

    if (has('ayuda', 'profesional', 'terapia', 'psicolog')) {
      return 'Puedo sugerirte hablar con un profesional. En la próxima entrega conectamos una API para recomendaciones reales.';
    }

    if (has('hola', 'buenas', 'buenos días')) {
      return '¡Hola! Soy OpenMind Bot (local). Cuéntame cómo te sientes hoy.';
    }

    return 'Gracias por contarlo. ¿Qué pasó y cómo te hizo sentir? Puedo proponerte pasos prácticos.';
  }
}
