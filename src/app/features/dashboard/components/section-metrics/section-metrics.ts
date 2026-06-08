import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe } from '@angular/common';
import { CustomSelect } from '../../../../shared/components/select/select';
import { GreenhouseStatistics } from '@models/analytics.model';

@Component({
  selector: 'app-section-metrics',
  imports: [FormsModule, DecimalPipe, CustomSelect],
  templateUrl: './section-metrics.html',
})
export class SectionMetrics implements OnInit {
  @Input() data: GreenhouseStatistics | null = null;
  @Input() isLoading = false;
  @Output() filterChange = new EventEmitter<{ date: string; node: string }>();
  selectedDate = '2026-06-08';
  selectedNode = 'A';
  nodeOptions = [
    { value: 'A', label: 'Nodo A' },
    { value: 'B', label: 'Nodo B' }
  ];
  ngOnInit() {
    this.emitFilters();
  }
  emitFilters() {
    this.filterChange.emit({ date: this.selectedDate, node: this.selectedNode });
  }
  calculateSoilPercentage(raw: number): number {
    if (!raw || raw >= 4095) return 0;
    if (raw <= 1500) return 100;
    const percentage = ((4095 - raw) / (4095 - 1500)) * 100;
    return Math.round(percentage);
  }
}