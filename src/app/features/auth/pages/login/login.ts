import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@components/button/button';

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
      if (this.email === 'admin@sysari.com' && this.password === 'admin123') {
        this.toastr.success('¡Bienvenido al sistema de control SIIT40!', 'Acceso Autorizado');
        this.router.navigate(['/dashboard/home']);
      } else {
        this.toastr.error('Credenciales incorrectas.', 'Error');
        this.isLoading = false;
      }
    }, 1500);
  }
}