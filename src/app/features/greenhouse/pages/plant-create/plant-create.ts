import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@components/button/button';
import { CustomInput } from '../../../../shared/components/input/input';
import { PlantService } from '../../../../core/services/plant.service';
import { SpecieService } from '../../../../core/services/specie.service';
import { Specie } from '../../../../core/models/specie.model';
import { environment } from '../../../../core/environments/environment';

@Component({
  selector: 'app-plant-create',
  imports: [FormsModule, Button, CustomInput],
  templateUrl: './plant-create.html',
})
export class PlantCreate implements OnInit {
  speciesList: Specie[] = [];
  isLoadingSpecies = false;
  isSubmitting = false;

  form = {
    greenhouse_id: environment.defaultGreenhouseId,
    species_id: '',
    zone: 'A',
    stage: 'Germinación',
    count: 1
  };

  private plantService = inject(PlantService);
  private specieService = inject(SpecieService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadSpecies();
  }

  loadSpecies() {
    this.isLoadingSpecies = true;
    this.specieService.getAll().subscribe({
      next: (response) => {
        this.isLoadingSpecies = false;
        if (response.status === 'success' && response.data.length > 0) {
          this.speciesList = response.data;
          this.form.species_id = response.data[0].species_id;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingSpecies = false;
        this.toastr.error('Error al cargar el catálogo de especies botánicas.', 'Error');
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/greenhouse/plants']);
  }

  onSubmit() {
    if (!this.form.species_id || !this.form.zone || !this.form.stage || !this.form.count) {
      this.toastr.warning('Por favor, completa todos los campos.', 'Campos incompletos');
      return;
    }
    this.isSubmitting = true;
    this.plantService.create(this.form).subscribe({
      next: (response) => {
        if (response.status === 'error') {
          this.isSubmitting = false;
          this.cdr.detectChanges();
          this.toastr.error(response.message?.[0]?.message || 'Error al registrar lote.', 'Fallo');
          return;
        }
        this.toastr.success('Siembra registrada con éxito en el invernadero.', 'Éxito');
        this.router.navigate(['/greenhouse/plants']);
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}