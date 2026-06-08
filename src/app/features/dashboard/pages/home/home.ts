import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { GreenhouseStatus, GreenhouseStatistics } from '../../../../core/models/analytics.model';
import { SectionStatus } from '@features/dashboard/components/section-status/section-status';
import { SectionMetrics } from '@features/dashboard/components/section-metrics/section-metrics';

@Component({
  selector: 'app-home',
  imports: [SectionStatus, SectionMetrics],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  statusData: GreenhouseStatus | null = null;
  metricsData: GreenhouseStatistics | null = null;
  isLoadingStatus = false;
  isLoadingMetrics = false;

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
          if (!response.data) {
            // El backend no registra hardware activo ese día, forzamos la UI a ceros sin romperla
            this.metricsData = this.getZeroedMetrics();
            const infoMsg = response.message?.[0]?.message || 'No hay datos de telemetría para los filtros seleccionados.';
            this.toastr.info(infoMsg, 'Información de red');
          } else {
            this.metricsData = response.data;
          }
        } else {
          this.toastr.error('No se pudieron procesar las estadísticas hídricas.', 'Error');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingMetrics = false;
        this.toastr.error('Error al conectar con la base de datos de telemetría.', 'Error de red');
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