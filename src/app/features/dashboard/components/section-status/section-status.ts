import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { GreenhouseStatus } from '@models/analytics.model';

@Component({
  selector: 'app-section-status',
  imports: [NgClass],
  templateUrl: './section-status.html',
})
export class SectionStatus {
  @Input() data: GreenhouseStatus | null = null;
  @Input() isLoading = false;
}