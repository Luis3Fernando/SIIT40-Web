import { TimeSeriesItem } from '../models/analytics.model';

export interface ChartDataStructure {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export class AnalyticsTransformer {
  static toMultiLineChart(rawData: TimeSeriesItem[], metric: keyof Omit<TimeSeriesItem, 'time_bucket' | 'nodo_id'>, metricLabel: string): ChartDataStructure {
    const labels = Array.from(new Set(rawData.map(item => item.time_bucket))).sort();
    const nodes = Array.from(new Set(rawData.map(item => item.nodo_id)));
    
    const colorPalette: { [key: string]: string } = {
      'A': '#129978', 
      'B': '#3b82f6', 
      'C': '#f59e0b'  
    };

    const datasets = nodes.map(nodeId => {
      const nodeDataByTime = labels.map(time => {
        const match = rawData.find(item => item.time_bucket === time && item.nodo_id === nodeId);
        return match ? (match[metric] as number) : 0;
      });

      const color = colorPalette[nodeId] || '#64748b';

      return {
        label: `${metricLabel} - Nodo ${nodeId}`,
        data: nodeDataByTime,
        borderColor: color,
        backgroundColor: `${color}1A`,
        tension: 0.3
      };
    });

    return { labels, datasets };
  }
}