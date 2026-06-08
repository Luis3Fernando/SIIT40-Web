import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@components/button/button';
import { CustomInput } from '../../../../shared/components/input/input';
import { SpecieService } from '../../../../core/services/specie.service';
import { SpecieUpdateDTO } from '../../../../core/models/specie.model';

@Component({
  selector: 'app-species-edit',
  imports: [FormsModule, Button, CustomInput],
  templateUrl: './edit.html',
})
export class EspeciesEdit implements OnInit {
  speciesId = '';
  isLoading = false;
  isSubmitting = false;

  form: SpecieUpdateDTO = {
    name: '',
    scientific_name: '',
    color: '#08D202',
    vol: 0,
    freq: 0,
    raw: 0
  };

  private specieService = inject(SpecieService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.speciesId = this.route.snapshot.paramMap.get('id') || '';
    if (this.speciesId) {
      this.loadSpecieDetails();
    }
  }

  loadSpecieDetails() {
    this.isLoading = true;
    this.specieService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          const currentSpecie = response.data.find(s => s.species_id === this.speciesId);
          if (currentSpecie) {
            this.form = {
              name: currentSpecie.name,
              scientific_name: currentSpecie.scientific_name,
              color: currentSpecie.color,
              vol: currentSpecie.vol,
              freq: currentSpecie.freq,
              raw: currentSpecie.raw
            };
          } else {
            this.toastr.error('La especie especificada no existe.', 'Error');
            this.goBack();
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Error al cargar los datos del perfil botánico.', 'Error de red');
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/species']);
  }

  onSubmit() {
    if (!this.form.name || !this.form.scientific_name || this.form.vol === null || this.form.freq === null || this.form.raw === null) {
      this.toastr.warning('Por favor, completa todos los campos requeridos.', 'Campos incompletos');
      return;
    }
    this.isSubmitting = true;
    this.specieService.update(this.speciesId, this.form).subscribe({
      next: (response) => {
        if (response.status === 'error') {
          this.isSubmitting = false;
          this.cdr.detectChanges();
          const errorMsg = response.message?.[0]?.message || 'No se pudo actualizar la especie.';
          this.toastr.error(errorMsg, 'Error de validación');
          return;
        }
        const successMsg = response.message?.[0]?.message || 'Especie actualizada correctamente.';
        this.toastr.success(successMsg, 'Éxito');
        this.router.navigate(['/species']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        const errorMsg = err.error?.message?.[0]?.message || 'Error al conectar con la base de datos.';
        this.toastr.error(errorMsg, 'Error de red');
      }
    });
  }
}