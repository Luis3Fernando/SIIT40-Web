import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { GreenhouseStatus, GreenhouseStatistics, WaterConsumptionData } from '../../../../core/models/analytics.model';
import { SectionStatus } from '@features/dashboard/components/section-status/section-status';
import { SectionMetrics } from '@features/dashboard/components/section-metrics/section-metrics';
import { SectionWater } from '@features/dashboard/components/section-water/section-water';

@Component({
  selector: 'app-home',
  imports: [SectionStatus, SectionMetrics, SectionWater],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  statusData: GreenhouseStatus | null = null;
  metricsData: GreenhouseStatistics | null = null;
  waterData: WaterConsumptionData | null = null;

  isLoadingStatus = false;
  isLoadingMetrics = false;
  isLoadingWater = false;

  private analyticsService = inject(AnalyticsService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadOperationalStatus();
  }

  loadOperationalStatus() {
    this.isLoadingStatus = true;
    this.analyticsService.getGreenhouseStatus().subscribe({
      next: (response) => {
        this.isLoadingStatus = false;
        if (response.status === 'success') {
          this.statusData = response.data;
        } else {
          this.toastr.error('No se pudo sincronizar el estado del invernadero.', 'Error de datos');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingStatus = false;
        this.toastr.error('Error de comunicación con el servidor de telemetría.', 'Error de red');
        this.cdr.detectChanges();
      }
    });
  }

  onMetricsFilterChange(filters: { date: string; node: string }) {
    this.isLoadingMetrics = true;
    this.analyticsService.getStatistics(1, filters.date, filters.node).subscribe({
      next: (response) => {
        this.isLoadingMetrics = false;
        if (response.status === 'success') {
          this.metricsData = response.data ? response.data : this.getZeroedMetrics();
          if (!response.data) this.toastr.info('No hay telemetría para los filtros seleccionados.', 'Info');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingMetrics = false;
        this.toastr.error('Error de conexión con la base de datos de sensores.', 'Error');
        this.cdr.detectChanges();
      }
    });
  }

  onWaterFilterChange(filters: { unit: string; start: string; end: string }) {
    this.isLoadingWater = true;
    this.analyticsService.getWaterConsumption(1, filters.unit, filters.start, filters.end).subscribe({
      next: (response) => {
        this.isLoadingWater = false;
        if (response.status === 'success') {
          this.waterData = response.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingWater = false;
        this.toastr.error('Error de comunicación al compilar métricas hídricas.', 'Error de red');
        this.cdr.detectChanges();
      }
    });
  }

  private getZeroedMetrics(): GreenhouseStatistics {
    return {
      temperature: { min: 0, max: 0, avg: 0 },
      humidity: { min: 0, max: 0, avg: 0 },
      soil_raw: { min: 0, max: 0, avg: 0 },
      ph: { min: 0, max: 0, avg: 0 },
      co2: { min: 0, max: 0, avg: 0 },
      lux: { min: 0, max: 0, avg: 0 },
      water_flow: { min: 0, max: 0, avg: 0 }
    };
  }
}