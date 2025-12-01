import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly TOKEN_KEY = "auth_token"
  private readonly CUSTOMER_ID_KEY = "customer_id";

  get<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  }
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  setToken(token: string): void {
    this.set(this.TOKEN_KEY, token)
  }

  removeToken(): void{
    localStorage.removeItem(this.TOKEN_KEY)
  }

  getToken(): string | null{
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setCustomerId(customerId: number): void {
    this.set(this.CUSTOMER_ID_KEY, customerId)
  }

  getCustomerId(): number | null {
    const id = localStorage.getItem('customerId');
    return id !== null ? Number(id) : null;
  }

  removeCustomerId(): void {
    localStorage.removeItem(this.CUSTOMER_ID_KEY)
  }

  clearAuth(): void{
    this.removeToken()
    this.removeCustomerId()
  }
}
