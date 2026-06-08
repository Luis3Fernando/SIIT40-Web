import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@components/button/button';
import { SpecieService } from '../../../../core/services/specie.service';
import { Specie } from '../../../../core/models/specie.model';

@Component({
  selector: 'app-species-list',
  imports: [Button],
  templateUrl: './list.html',
})
export class EspeciesList implements OnInit {
  species: Specie[] = [];
  isLoading = false;

  private specieService = inject(SpecieService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadSpecies();
  }

  loadSpecies() {
    this.isLoading = true;
    this.specieService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          this.species = response.data;
        } else {
          this.toastr.error('No se pudo procesar el catálogo de especies.', 'Error');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Error de comunicación con el servidor hídrico.', 'Error de red');
        this.cdr.detectChanges();
      }
    });
  }

  goToCreate() {
    this.router.navigate(['/species/create']);
  }

  goToEdit(id: string) {
    this.router.navigate([`/species/edit/${id}`]);
  }
}