import { Injectable } from '@angular/core';
// 1. REMOVED unnecessary imports like ActivatedRouteSnapshot, Route, UrlSegment, subPath
import { CanActivate, CanMatch, Router, UrlTree } from '@angular/router'; 
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanMatch { // Still implement both

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Private helper function remains the same
  private canAccessAdmin(): boolean | UrlTree {
    if (this.authService.isAdmin()) {
      return true; // User is an admin, allow access
    } else {
      // User is not an admin, redirect to the home page
      console.warn('AdminGuard: Access denied. User is not an admin.');
      return this.router.createUrlTree(['/tabs/home']); 
    }
  }

  // 2. SIMPLIFIED canActivate signature
  canActivate(): boolean | UrlTree {
    return this.canAccessAdmin();
  }
  
  // 3. SIMPLIFIED canMatch signature (replaces canLoad)
  canMatch(): boolean | UrlTree { 
    return this.canAccessAdmin();
  }
}