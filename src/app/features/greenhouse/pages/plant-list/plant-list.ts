import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@components/button/button';
import { Modal } from '../../../../shared/components/modal/modal';
import { PlantService } from '../../../../core/services/plant.service';
import { Plant } from '../../../../core/models/plant.model';

@Component({
  selector: 'app-plant-list',
  imports: [Button, Modal],
  templateUrl: './plant-list.html',
})
export class PlantList implements OnInit {
  plants: Plant[] = [];
  isLoading = false;
  isDeleteModalOpen = false;
  isDeleting = false;
  selectedPlantId: number | null = null;

  private plantService = inject(PlantService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadPlants();
  }

  loadPlants() {
    this.isLoading = true;
    this.plantService.getByGreenhouse().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          this.plants = response.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Error al recuperar el inventario del invernadero.', 'Error de red');
        this.cdr.detectChanges();
      }
    });
  }

  goToCreate() {
    this.router.navigate(['/greenhouse/plants/create']);
  }

  goToEdit(id: number) {
    this.router.navigate([`/greenhouse/plants/edit/${id}`]);
  }

  openDeleteModal(id: number) {
    this.selectedPlantId = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedPlantId = null;
  }

  confirmDelete() {
    if (this.selectedPlantId === null) return;
    this.isDeleting = true;
    this.plantService.delete(this.selectedPlantId).subscribe({
      next: (response) => {
        this.isDeleting = false;
        this.closeDeleteModal();
        if (response.status === 'success') {
          this.toastr.success('Planta dada de baja correctamente.', 'Éxito');
          this.loadPlants();
        } else {
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.toastr.error('No se pudo comunicar la baja al servidor hídrico.', 'Error de red');
        this.cdr.detectChanges();
      }
    });
  }
}