import { Injectable, inject, signal } from '@angular/core';
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
  private readonly userKey = 'siit_user_info';

  currentUser = signal<{ fullName: string; email: string } | null>(this.getUserFromStorage());

  login(credentials: LoginCredentials): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          this.saveTokens(response.data.accessToken, response.data.refreshToken);
          const userProfile = { fullName: response.data.fullName, email: response.data.email };
          localStorage.setItem(this.userKey, JSON.stringify(userProfile));
          this.currentUser.set(userProfile);
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
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<RefreshData>> {
    return this.http.post<ApiResponse<RefreshData>>(`${environment.apiUrl}/auth/refresh`, { refreshToken });
  }

  private getUserFromStorage() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}