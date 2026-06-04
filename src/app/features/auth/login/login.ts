import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  isLoading = false;
  logoPath = 'assets/icons/logo.png';

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.toastr.warning('Por favor, completa todos los campos.', 'Campos Vacíos');
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      
      if (this.email === 'admin@siit.com' && this.password === 'admin123') {
        this.toastr.success('¡Bienvenido al sistema de control SIIT40!', 'Acceso Autorizado');
      } else {
        this.toastr.error('Credenciales incorrectas.', 'Error');
      }
    }, 1500);
  }
}