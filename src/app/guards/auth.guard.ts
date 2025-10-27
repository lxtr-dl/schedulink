import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators'; // Removed filter for now
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private checkAuth(): Observable<boolean | UrlTree> {
    console.log('AuthGuard: checkAuth() running...'); 
    return this.authService.isAuthenticated$.pipe(
      filter(isAuth => isAuth !== null && isAuth !== undefined), // Add filter back
      take(1), 
      map(isAuthenticated => {
        console.log(`AuthGuard: isAuthenticated$ emitted: ${isAuthenticated}`); 
        if (isAuthenticated) {
          console.log('AuthGuard: Access granted.'); 
          return true; 
        } else {
          console.log('AuthGuard: Access DENIED, redirecting to login.'); 
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkAuth();
  }

  canLoad(): Observable<boolean | UrlTree> {
    return this.checkAuth();
  }
}