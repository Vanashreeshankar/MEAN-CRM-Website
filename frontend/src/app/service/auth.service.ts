import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable,  catchError, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private messageVisibilitySubject = new BehaviorSubject<boolean>(false);
  messageVisibility$ = this.messageVisibilitySubject.asObservable();

  private tokenPayload: any;

  constructor(private router: Router, private userService: UserService) { 
    
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('accessJWT');
    if (!token) {
      console.log('No access token found. Redirecting to sign-in.');
      this.router.navigate(['/']);
      return false;
    } else {
      console.log('Access token found. User is authenticated.');
      return true;
    }
  }

  private isTokenExpired(token: string): boolean {
    const tokenPayload: any = jwtDecode(token);
    const isExpired = (tokenPayload.exp * 1000) < new Date().getTime();
    console.log('Token payload:', tokenPayload);
    console.log('Is token expired:', isExpired);
    return isExpired;
  }

  public checkAndRefreshToken(): Observable<boolean> {
    const accessJWT = localStorage.getItem('accessJWT');
    if (!accessJWT || this.isTokenExpired(accessJWT)) {
      console.log('Token is missing or expired. Attempting to refresh.');
      return this.userService.refreshToken().pipe(
        tap(token => {
          console.log('New access token received:', token);
          this.userService.storeTokens(token);
        }),
        catchError(error => {
          console.log('Failed to refresh token:', error);
          // Handle error appropriately, possibly navigate to login page
          // e.g., this.router.navigate(['/signin']);
          return of(false);  // or throwError(error) if you want to propagate the error
        }),
        tap(() => true)
      );
    } else {
      console.log('Token is valid.');
      return of(true);
    }
  }

  getUserRole(){
    return localStorage.getItem('role')
  }


  setTokenPayload(payload: any): void {
    this.tokenPayload = payload;
  }

  getTokenPayload(): any {
    return this.tokenPayload;

  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  toggleMessageVisibility() {
    const currentValue = this.messageVisibilitySubject.value;
    this.messageVisibilitySubject.next(!currentValue);
  }

}
