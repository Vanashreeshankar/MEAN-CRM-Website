import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { GlobalConstants } from '../material/global-constants';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    private router: Router,
    private snackBar: SnackbarService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let expectedRoleArray: string[]  = route.data['expectedRole'];
      console.log("Expected Role Array:", expectedRoleArray); // Check if expected roles are retrieved correctly
 
      const token: string | null = localStorage.getItem('accessJWT');
      console.log("Token:", token); // Check if token is retrieved correctly

      if (!token) {
        localStorage.clear();
        this.router.navigateByUrl('/');
        return false;
      }

      let tokenPayload: any;
 
      try {
        tokenPayload = jwtDecode(token);
        console.log("Decoded Token Payload:", tokenPayload); // Check if token is decoded correctly
        this.auth.setTokenPayload(tokenPayload);  // Store the token payload
      } catch (error) {
        console.error("Error decoding token:", error);
        //localStorage.clear();
        this.router.navigateByUrl('/');
        return false;
      }
 
      let checkRole = false;
 
      for (let role of expectedRoleArray) {
        if (role === tokenPayload.role) {
          checkRole = true;
          break; // Exit loop early since we found a matching role
        }
      }
 
      console.log("Is Role Check Successful?", checkRole); // Check if role check is successful

      if (tokenPayload.role === 'user' || tokenPayload.role === 'admin') {
        if (this.auth.isAuthenticated() && checkRole) {
          return true;
        }
       
        this.snackBar.openSnackBar(
          GlobalConstants.unauthorized,
          GlobalConstants.error
        );
 
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        this.router.navigate(['/']);
        //localStorage.clear();
        return false;
      }
  }
}
