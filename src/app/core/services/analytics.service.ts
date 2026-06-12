import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResponse } from '../models/api-response';
import { GreenhouseStatistics, GreenhouseStatus, TimeSeriesItem, WaterConsumptionData } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getStatistics(greenhouseId: number = environment.defaultGreenhouseId, date: string, node: string): Observable<ApiResponse<GreenhouseStatistics>> {
    const params = new HttpParams().set('fecha', date).set('nodo', node);
    return this.http.get<ApiResponse<GreenhouseStatistics>>(`${this.baseUrl}/statistics/greenhouse/${greenhouseId}`, { params });
  }

  getGreenhouseStatus(greenhouseId: number = environment.defaultGreenhouseId): Observable<ApiResponse<GreenhouseStatus>> {
    return this.http.get<ApiResponse<GreenhouseStatus>>(`${this.baseUrl}/greenhouse/status/${greenhouseId}`);
  }

  getTimeSeries(greenhouseId: number = environment.defaultGreenhouseId, groupBy: 'day' | 'hour', startDate?: string, endDate?: string, node?: string): Observable<ApiResponse<TimeSeriesItem[]>> {
    let params = new HttpParams().set('group_by', groupBy);
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    if (node) params = params.set('nodo', node);
    return this.http.get<ApiResponse<TimeSeriesItem[]>>(`${this.baseUrl}/analytics/time-series/${greenhouseId}`, { params });
  }

  getWaterConsumption(greenhouseId: number = environment.defaultGreenhouseId, bucketUnit: string, startDate: string, endDate: string): Observable<ApiResponse<WaterConsumptionData>> {
    const params = new HttpParams().set('bucket_unit', bucketUnit).set('start_date', startDate).set('end_date', endDate);
    return this.http.get<ApiResponse<WaterConsumptionData>>(`${this.baseUrl}/analytics/water-consumption/${greenhouseId}`, { params });
  }
}