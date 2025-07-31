// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// Only Session type is needed here
import { Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Directly await the session object, which is likely what your service returns.
    const session: Session | null = await this.authService.getSession();
    console.log('AuthGuard session check:', session); // 🧪 Debug the session

    if (session) {
      console.log('AuthGuard: Session found, allowing access.');
      return true;
    } else {
      console.log('AuthGuard: No session found, redirecting to login.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}