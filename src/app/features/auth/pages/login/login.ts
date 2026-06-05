import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@components/button/button';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, Button],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  isLoading = false;
  showPassword = false;
  logoPath = 'assets/icons/logo.png';

  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  onLogin() {
    if (!this.email || !this.password) {
      this.toastr.warning('Por favor, completa todos los campos.', 'Campos vacíos');
      return;
    }
    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        const welcomeMessage = response.message?.[0]?.message || 'Autenticación exitosa.';
        this.toastr.success(welcomeMessage, 'Bienvenido');
        this.router.navigate(['/dashboard/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        const errorMessage = err.error?.message?.[0]?.message || 'Credenciales incorrectas.';
        this.toastr.error(errorMessage, 'Error de autenticación');
      }
    });
  }
}