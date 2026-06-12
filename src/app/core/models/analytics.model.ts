export interface MetricStats {
  min: number;
  max: number;
  avg: number;
}

export interface GreenhouseStatistics {
  temperature: MetricStats;
  humidity: MetricStats;
  soil_raw: MetricStats;
  ph: MetricStats;
  co2: MetricStats;
  lux: MetricStats;
  water_flow: MetricStats;
}

export interface PlantSummary {
  total_plants_count: number;
  active_crop_sectors: number;
  has_critical_plants: boolean;
}

export interface GreenhouseStatus {
  greenhouse_id: number;
  plant_summary: PlantSummary;
  latest_telemetry: any | null;
}

export interface TimeSeriesItem {
  time_bucket: string;
  nodo_id: string;
  temp_c: number;
  hum_pct: number;
  soil_raw: number;
  ph: number;
  co2: number;
  lux: number;
  flow_lmin: number;
  total_l: number;
}

export interface WaterConsumptionBreakdown {
  time_bucket: string;
  total_liters: number;
  average_flow_rate: number;
  irrigation_events: number;
}

export interface WaterConsumptionData {
  greenhouse_id: number;
  global_total_liters: number;
  global_irrigation_events: number;
  breakdown: WaterConsumptionBreakdown[];
}