import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResponse } from '../models/api-response';
import { Specie, SpecieCreateDTO, SpecieUpdateDTO } from '../models/specie.model';

@Injectable({
  providedIn: 'root'
})
export class SpecieService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/specie`;

  getAll(): Observable<ApiResponse<Specie[]>> {
    return this.http.get<ApiResponse<Specie[]>>(this.apiUrl);
  }

  create(data: SpecieCreateDTO): Observable<ApiResponse<Specie>> {
    return this.http.post<ApiResponse<Specie>>(this.apiUrl, data);
  }

  update(speciesId: string, data: SpecieUpdateDTO): Observable<ApiResponse<Specie>> {
    return this.http.patch<ApiResponse<Specie>>(`${this.apiUrl}/${speciesId}`, data);
  }

  delete(speciesId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${speciesId}`);
  }
}