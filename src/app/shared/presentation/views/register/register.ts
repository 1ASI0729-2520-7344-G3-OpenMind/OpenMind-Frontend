import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {AuthService} from '../../../../core/services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  hidePassword = true;
  hideConfirmPassword = true;
  registerForm: FormGroup;
  loading = false;
  errorMessage = "";
  successMessage = "";

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [this.passwordsMatchValidator()] }
    );
  }

  private passwordsMatchValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirm = group.get('confirmPassword')?.value;
      if (!password || !confirm) return null;
      return password === confirm ? null : { passwordsMismatch: true };
    };
  }

  onSubmit() {
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched()
      return
    }
    this.loading = true
    this.errorMessage = ""
    this.successMessage = ""

    const{name, email, password} = this.registerForm.value;

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.loading = false
        this.successMessage = "¡Cuenta creada con exito!"
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 1500)
        alert("Cuenta registrada con exito!")
        this.router.navigate(['/'])
      },
      error: (err) => {
        this.loading = false
        this["errorMessage"] = err.error?.message || "Error al crear la cuenta. Intentalo nuevamente"
      }
    })
  }

  goToLogin() {
    this.router.navigate(['/']);
  }

  get f(){
    return this.registerForm.controls;
  }
}
