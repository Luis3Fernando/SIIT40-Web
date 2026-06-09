import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { CustomSelect } from '../../../../shared/components/select/select';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { TimeSeriesItem } from '../../../../core/models/analytics.model';
import { AnalyticsTransformer } from '../../../../core/utils/analytics-transformer';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  imports: [FormsModule, NgClass, DecimalPipe, DatePipe, BaseChartDirective, CustomSelect],
  templateUrl: './analytics.html',
})
export class Analytics implements OnInit {
  timeSeriesData: TimeSeriesItem[] = [];
  isLoading = false;
  groupBy: 'day' | 'hour' = 'day';
  startDate = '2026-01-01';
  endDate = '2026-03-31';
  selectedNode = 'ALL';

  tempData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  humData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  soilData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  phData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  co2Data: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  luxData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  flowData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  totalData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 10, font: { family: 'sans-serif', size: 10, weight: 'bold' } } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 } } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.03)' }, ticks: { font: { size: 9 } } }
    }
  };

  groupByOptions = [
    { value: 'day', label: 'Macro (Por Días)' },
    { value: 'hour', label: 'Detalle Fino (Por Horas)' }
  ];

  nodeOptions = [
    { value: 'ALL', label: 'Todos los nodos' },
    { value: 'A', label: 'Nodo A' },
    { value: 'B', label: 'Nodo B' }
  ];

  private analyticsService = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.fetchTimeSeries();
  }

  fetchTimeSeries() {
    this.isLoading = true;
    const nodeParam = this.selectedNode === 'ALL' ? undefined : this.selectedNode;
    this.analyticsService.getTimeSeries(1, this.groupBy, this.startDate, this.endDate, nodeParam).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          this.timeSeriesData = response.data;
          this.updateAllCharts();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateAllCharts() {
    if (!this.timeSeriesData || this.timeSeriesData.length === 0) return;
    const formattedLabels = Array.from(new Set(this.timeSeriesData.map(item => item.time_bucket)))
      .sort()
      .map(l => this.groupBy === 'hour' 
        ? new Date(l).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : new Date(l).toLocaleDateString([], { day: '2-digit', month: '2-digit' })
      );

    this.tempData = { labels: formattedLabels, datasets: AnalyticsTransformer.toMultiLineChart(this.timeSeriesData, 'temp_c', 'Temp.').datasets };
    this.humData = { labels: formattedLabels, datasets: AnalyticsTransformer.toMultiLineChart(this.timeSeriesData, 'hum_pct', 'Humedad').datasets };
    this.soilData = { labels: formattedLabels, datasets: AnalyticsTransformer.toMultiLineChart(this.timeSeriesData, 'soil_raw', 'Suelo').datasets };
    this.phData = { labels: formattedLabels, datasets: AnalyticsTransformer.toMultiLineChart(this.timeSeriesData, 'ph', 'pH').datasets };
    this.co2Data = { labels: formattedLabels, datasets: AnalyticsTransformer.toMultiLineChart(this.timeSeriesData, 'co2', 'CO2').datasets };
    this.luxData = { labels: formattedLabels, datasets: AnalyticsTransformer.toMultiLineChart(this.timeSeriesData, 'lux', 'Iluminancia').datasets };
    this.flowData = { labels: formattedLabels, datasets: AnalyticsTransformer.toMultiLineChart(this.timeSeriesData, 'flow_lmin', 'Caudal').datasets };
    this.totalData = { labels: formattedLabels, datasets: AnalyticsTransformer.toMultiLineChart(this.timeSeriesData, 'total_l', 'Volumen').datasets };
  }
}