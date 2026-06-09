import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TimeSeriesItem } from '@models/analytics.model';

@Component({
  selector: 'app-analytics-chart',
  imports: [BaseChartDirective],
  templateUrl: './analytics-chart.html',
})
export class AnalyticsChart implements OnChanges {
  @Input() data: TimeSeriesItem[] = [];
  @Input() metric: keyof Omit<TimeSeriesItem, 'time_bucket' | 'nodo_id'> = 'temp_c';
  @Input() title = '';
  @Input() unit = '';
  @Input() groupBy: 'day' | 'hour' = 'day';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Corregimos la inferencia forzando el tipo literal estricto que exige el compilador
  chartType: 'line' = 'line';
  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#AAE1D6', font: { family: 'sans-serif', size: 10, weight: 'bold' } } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#CACBCE', font: { size: 9 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#CACBCE', font: { size: 9 } } }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['metric']) {
      this.processChartData();
    }
  }

  private processChartData() {
    if (!this.data || this.data.length === 0) {
      this.chartData = { labels: [], datasets: [] };
      return;
    }
    const uniqueTimestamps = Array.from(new Set(this.data.map(item => item.time_bucket))).sort();
    const nodes = Array.from(new Set(this.data.map(item => item.nodo_id)));
    const colorPalette: { [key: string]: string } = {
      'A': '#129978',
      'B': '#D1F700'
    };
    const datasets = nodes.map(nodeId => {
      const nodeValues = uniqueTimestamps.map(time => {
        const match = this.data.find(item => item.time_bucket === time && item.nodo_id === nodeId);
        return match ? (match[this.metric] as number) : 0;
      });
      const color = colorPalette[nodeId] || '#CACBCE';
      return {
        label: `Nodo ${nodeId}`,
        data: nodeValues,
        borderColor: color,
        backgroundColor: `${color}10`,
        borderWidth: 2,
        pointRadius: 1.5,
        tension: 0.3,
        fill: true
      };
    });
    this.chartData = {
      labels: uniqueTimestamps.map(t => {
        const date = new Date(t);
        return this.groupBy === 'hour' 
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
      }),
      datasets
    };
    this.chart?.update();
  }
}