import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Conversacion, Mensaje } from '../../../shared/models/chat.models';
import { LocalStorageService } from '../../../core/storage/local-storage.service';
import { LocalLlmService } from '../ai/local-llm.service';

const LS = 'openmind_chat_history';
const uuid = () => (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));

@Injectable({ providedIn: 'root' })
export class ChatRepository {
  private _history: Conversacion[] = [];
  private _current$ = new BehaviorSubject<Conversacion>({ id: uuid(), titulo: 'Nueva conversación', mensajes: [] });
  current$ = this._current$.asObservable();

  constructor(private ls: LocalStorageService, private ai: LocalLlmService) {
    this._history = this.ls.get<Conversacion[]>(LS, []);
  }
  private clone<T>(value: T): T {
    const structured = (globalThis as { structuredClone?: <U>(input: U, options?: any) => U }).structuredClone;
    return typeof structured === 'function'
      ? structured(value)
      : JSON.parse(JSON.stringify(value));
  }
  private save(){ this.ls.set(LS, this._history); }
  getHistory(){ return [...this._history].sort((a,b)=>b.mensajes.length-a.mensajes.length); }
  nuevaConversacion(titulo='Nueva conversación'){ this._current$.next({ id: uuid(), titulo, mensajes: [] }); }
  abrirConversacion(id:string){ const f=this._history.find(c=>c.id===id); if(f) this._current$.next(this.clone(f)); }
  getConversacionActual(){ const actual=this._current$.value; return actual?this.clone(actual):undefined; }
  guardarConversacion(titulo:string){
    const c=this._current$.value, conv:{ id:string; titulo:string; mensajes:Mensaje[] }={...c, id:c.id||uuid(), titulo};
    const i=this._history.findIndex(x=>x.id===conv.id); if(i>=0) this._history[i]=conv; else this._history.unshift(conv); this.save();
  }
  eliminarConversacion(id:string){ this._history=this._history.filter(c=>c.id!==id); this.save(); }

  async enviarMensajeUsuario(text:string){
    const c=this._current$.value;
    const user:Mensaje={id:uuid(), from:'user', text, ts:Date.now()};
    let updated:Conversacion={...c, mensajes:[...c.mensajes, user]};
    const pid=uuid(); const typing:Mensaje={id:pid, from:'bot', text:'···', ts:Date.now()+1};
    updated={...updated, mensajes:[...updated.mensajes, typing]}; this._current$.next(updated);
    const reply=await this.ai.generate(text);
    const mensajes=updated.mensajes.map(m=>m.id===pid?{...m, text:reply, ts:Date.now()+2}:m);
    this._current$.next({...updated, mensajes});
  }
}
