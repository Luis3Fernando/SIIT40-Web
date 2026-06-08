import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, Specie, SpecieCreateDTO, SpecieUpdateDTO } from '../models/specie.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecieService {
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiUrl}/specie`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<APIResponse<Specie[]>> {
    return this.http.get<APIResponse<Specie[]>>(this.apiUrl);
  }

  create(data: SpecieCreateDTO): Observable<APIResponse<Specie>> {
    return this.http.post<APIResponse<Specie>>(this.apiUrl, data);
  }

  update(speciesId: string, data: SpecieUpdateDTO): Observable<APIResponse<Specie>> {
    return this.http.patch<APIResponse<Specie>>(`${this.apiUrl}/${speciesId}`, data);
  }

  delete(speciesId: string): Observable<APIResponse<void>> {
    return this.http.delete<APIResponse<void>>(`${this.apiUrl}/${speciesId}`);
  }
}