import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { UserService } from './user.service';
import { SnackbarService } from './snackbar.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
 
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/token')) {
      // For token refresh requests, use the refreshJWT
      const refreshToken = this.userService.getRefreshToken();
      if (refreshToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `${refreshToken}`
          }
        });
      }
    } else {
      // For all other requests, use the accessJWT
      const accessToken = this.userService.getAccessToken();
      if (accessToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `${accessToken}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          return this.userService.refreshToken().pipe(
            switchMap((tokens: any) => {
              this.userService.storeTokens(tokens);
              request = this.addToken(request, tokens.accessJWT);
              return next.handle(request);
            }),
            catchError((err) => {
              this.userService.logout();
              return throwError(err);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}