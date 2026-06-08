import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@components/button/button';
import { PlantService } from '../../../../core/services/plant.service';

@Component({
  selector: 'app-plant-edit',
  imports: [FormsModule, Button],
  templateUrl: './plant-edit.html',
})
export class PlantEdit implements OnInit {
  plantId = 0;
  isLoading = false;
  isSubmitting = false;
  specieName = '';

  form = {
    stage: 'Vegetativo'
  };

  private plantService = inject(PlantService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.plantId = Number(this.route.snapshot.paramMap.get('id') || '0');
    if (this.plantId) {
      this.loadPlantDetails();
    }
  }

  loadPlantDetails() {
    this.isLoading = true;
    this.plantService.getByGreenhouse().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          const plant = response.data.find(p => p.id === this.plantId);
          if (plant) {
            this.form.stage = plant.stage;
            this.specieName = plant.specie.name;
          } else {
            this.toastr.error('El lote vegetal no se encuentra registrado.', 'Error');
            this.goBack();
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/greenhouse/plants']);
  }

  onSubmit() {
    this.isSubmitting = true;
    this.plantService.update(this.plantId, this.form).subscribe({
      next: (response) => {
        if (response.status === 'error') {
          this.isSubmitting = false;
          this.cdr.detectChanges();
          return;
        }
        this.toastr.success('Etapa fenológica actualizada correctamente.', 'Éxito');
        this.router.navigate(['/greenhouse/plants']);
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}