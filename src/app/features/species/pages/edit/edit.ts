import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Button } from '@components/button/button';

@Component({
  selector: 'app-species-edit',
  imports: [FormsModule, Button],
  templateUrl: './edit.html',
})
export class EspeciesEdit {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/species']);
  }
}