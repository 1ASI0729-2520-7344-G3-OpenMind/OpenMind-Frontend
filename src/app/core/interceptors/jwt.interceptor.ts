import {LocalStorageService} from '../storage/local-storage.service'
import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private storage: LocalStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    const token = this.storage.getToken()
    if(token){
      req = req.clone({
        setHeaders: {Authorization: `Bearer ${token}`},
      })
    }
    return next.handle(req)
  }
}
