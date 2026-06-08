import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '@components/button/button';

@Component({
  selector: 'app-species-list',
  imports: [Button],
  templateUrl: './list.html',
})
export class EspeciesList {
  private router = inject(Router);

  goToCreate() {
    this.router.navigate(['/species/create']);
  }

  goToEdit(id: number) {
    this.router.navigate([`/species/edit/${id}`]);
  }
}