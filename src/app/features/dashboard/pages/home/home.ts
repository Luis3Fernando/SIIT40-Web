import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { GreenhouseStatus } from '../../../../core/models/analytics.model';
import { SectionStatus } from '@features/dashboard/components/section-status/section-status';

@Component({
  selector: 'app-home',
  imports: [SectionStatus],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  statusData: GreenhouseStatus | null = null;
  isLoadingStatus = false;

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
}