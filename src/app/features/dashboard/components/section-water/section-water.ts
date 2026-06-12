import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { WaterConsumptionData } from '@models/analytics.model';

@Component({
  selector: 'app-section-water',
  imports: [FormsModule, DecimalPipe, DatePipe],
  templateUrl: './section-water.html',
})
export class SectionWater implements OnInit {
  @Input() data: WaterConsumptionData | null = null;
  @Input() isLoading = false;
  @Output() filterChange = new EventEmitter<{ unit: string; start: string; end: string }>();

  selectedUnit = 'month';
  startDate = '2026-01-01';
  endDate = '2026-04-30';

  ngOnInit() {
    this.emitFilters();
  }

  emitFilters() {
    this.filterChange.emit({ unit: this.selectedUnit, start: this.startDate, end: this.endDate });
  }
}