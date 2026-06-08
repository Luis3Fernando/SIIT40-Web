import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Button } from '@components/button/button';

@Component({
  selector: 'app-species-create',
  imports: [FormsModule, Button],
  templateUrl: './create.html',
})
export class EspeciesCreate {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/species']);
  }
}
