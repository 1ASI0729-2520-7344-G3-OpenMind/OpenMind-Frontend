import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {MatError} from '@angular/material/form-field'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatError
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  hidePassword = true;
  loginForm: FormGroup;
  loading = false;
  errorMessage = "";

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = "";

    const {email, password} = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        let token: string
        if(typeof response === "string"){
          token = response;
        }else if(response && typeof response === "object"){
          token = response.token || response;
        }else{
          token = response;
          token = JSON.parse(response);
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        const customerId = payload.userId;
        const email = payload.email;
        localStorage.setItem('token', token);
        localStorage.setItem('customerId', customerId);
        localStorage.setItem('email', email);
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || "Credenciales incorrectas. Intentalo nuevamente";
        console.error("Login error: ", err);
      }
    })
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
