import { Injectable } from '@angular/core';
// 1. Import CanActivate, not CanLoad
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
// 2. Implement CanActivate
export class AuthGuard implements CanActivate { 

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // 3. This function is now canActivate()
  canActivate(): Observable<boolean | UrlTree> { 
    // Use the new isAuthenticated$ observable from your AuthService
    return this.authService.isAuthenticated$.pipe(
      take(1), // Take the first value and complete
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true; // User is logged in, allow access
        } else {
          // User is not logged in, redirect to login
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}