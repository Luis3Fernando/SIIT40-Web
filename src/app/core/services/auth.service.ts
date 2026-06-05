import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ApiResponse, AuthData, RefreshData } from '../models/api-response';
import { LoginCredentials } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly accessTokenKey = 'siit_access_token';
  private readonly refreshTokenKey = 'siit_refresh_token';

  login(credentials: LoginCredentials): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          this.saveTokens(response.data.accessToken, response.data.refreshToken);
        }
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<RefreshData>> {
    return this.http.post<ApiResponse<RefreshData>>(`${environment.apiUrl}/auth/refresh`, { refreshToken });
  }
}