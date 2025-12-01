import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {tap} from 'rxjs/operators'
import {LocalStorageService} from '../storage/local-storage.service'
import { environment } from '../../../environments/environment';

export interface LoginResponse{
  token: string,
  customerId: number
}

export interface RegisterResponse{
  token: string
  customerId: number
  message?: string
}

@Injectable({providedIn: 'root'})
export class AuthService{
  private apiUrl = `${environment.apiBase}/auth`

  constructor(private http: HttpClient, private storage: LocalStorageService) { }

  login(email: string, password: string){
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {email, password}).pipe(tap(res =>{
      this.storage.setToken(res.token)
      this.storage.setCustomerId(res.customerId)
    }))
  }

  register(name: string, email: string, password: string){
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {name, email, password}).pipe(tap(res =>{
      this.storage.setToken(res.token)
      this.storage.setCustomerId(res.customerId)
    }))
  }

  logout(){
    this.storage.clearAuth()
  }

  isLoggedIn(): boolean{
    return !!this.storage.getToken()
  }

  getCustomerId(): number | null{
    return this.storage.getCustomerId()
  }
}
