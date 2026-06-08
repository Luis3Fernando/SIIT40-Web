import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResponse } from '../models/api-response';
import { Plant, PlantCreateDTO, PlantUpdateDTO } from '../models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/plant`;

  getByGreenhouse(greenhouseId: number = environment.defaultGreenhouseId): Observable<ApiResponse<Plant[]>> {
    return this.http.get<ApiResponse<Plant[]>>(`${this.apiUrl}/greenhouse/${greenhouseId}`);
  }

  create(data: PlantCreateDTO): Observable<ApiResponse<Plant>> {
    return this.http.post<ApiResponse<Plant>>(this.apiUrl, data);
  }

  update(plantId: number, data: PlantUpdateDTO): Observable<ApiResponse<Plant>> {
    return this.http.patch<ApiResponse<Plant>>(`${this.apiUrl}/${plantId}`, data);
  }

  delete(plantId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${plantId}`);
  }
}