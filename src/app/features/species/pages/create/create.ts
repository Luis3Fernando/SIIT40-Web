import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@components/button/button';
import { Popover } from '../../../../shared/components/popover/popover';
import { SpecieService } from '../../../../core/services/specie.service';
import { SpecieCreateDTO } from '../../../../core/models/specie.model';
import { CustomInput } from '@components/input/input';

@Component({
  selector: 'app-species-create',
  imports: [FormsModule, Button, CustomInput],
  templateUrl: './create.html',
})
export class EspeciesCreate {
  name = '';
  scientificName = '';
  imageUrl = '';
  color = '#08D202';
  vol: number | null = null;
  freq: number | null = null;
  raw: number | null = null;
  isLoading = false;

  private specieService = inject(SpecieService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  goBack() {
    this.router.navigate(['/species']);
  }

  onSubmit() {
    if (!this.name || !this.scientificName || this.vol === null || this.freq === null || this.raw === null) {
      this.toastr.warning('Por favor, completa todos los campos requeridos.', 'Campos incompletos');
      return;
    }
    this.isLoading = true;
    const data: SpecieCreateDTO = {
      name: this.name,
      scientific_name: this.scientificName,
      image_url: this.imageUrl,
      color: this.color,
      vol: this.vol,
      freq: this.freq,
      raw: this.raw
    };
    this.specieService.create(data).subscribe({
      next: (response) => {
        if (response.status === 'error') {
          this.isLoading = false;
          this.cdr.detectChanges();
          const errorMsg = response.message?.[0]?.message || 'No se pudo registrar la especie.';
          this.toastr.error(errorMsg, 'Error de validación');
          return;
        }
        const successMsg = response.message?.[0]?.message || 'Especie guardada correctamente.';
        this.toastr.success(successMsg, 'Éxito');
        this.router.navigate(['/species']);
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        const errorMsg = err.error?.message?.[0]?.message || 'Error al conectar con la base de datos.';
        this.toastr.error(errorMsg, 'Error de red');
      }
    });
  }
}