import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

const addTokenHeader = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
};

const handle401Error = (request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService, router: Router): Observable<HttpEvent<unknown>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    const token = authService.getRefreshToken();
    if (token) {
      return authService.refreshToken(token).pipe(
        switchMap((response) => {
          isRefreshing = false;
          authService.saveTokens(response.data.accessToken, response.data.refreshToken);
          refreshTokenSubject.next(response.data.accessToken);
          return next(addTokenHeader(request, response.data.accessToken));
        }),
        catchError((error) => {
          isRefreshing = false;
          authService.clearTokens();
          router.navigate(['/']);
          return throwError(() => error);
        })
      );
    }
  }
  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token) => next(addTokenHeader(request, token!)))
  );
};

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAccessToken();
  let authReq = req;
  if (token && !req.url.includes('/auth/refresh')) {
    authReq = addTokenHeader(req, token);
  }
  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !authReq.url.includes('/auth/login')) {
        return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};