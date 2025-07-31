import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user'; // 👈 Make sure this file exists
import { SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment'; // 👈 Needed for URL

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;
  private _currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.supabase = this.authService.getClient();
  }

  clearCurrentUser() {
    this._currentUser = null;
  }


  // ✅ Fetch user profile from `users` table using uid
  async loadCurrentUser() {
    const supaUser = await this.authService.getUser();
    if (!supaUser) throw new Error('User not found in auth.');

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('uid', supaUser.id)
      .single();

    if (error) throw error;

    this._currentUser = data;
    return data;
  }

  get currentUser(): User | null {
    return this._currentUser;
  }

  isAdmin(): boolean {
    return this._currentUser?.role?.some(r =>
      ['music director', 'coordinator', 'worship leader'].includes(r.toLowerCase())
    ) ?? false;
  }

  // ✅ Admin-only function to create new user via Supabase Edge Function
  // In your UserService.ts

  async createUserViaEdge(email: string, password: string, name: string, role: string[]) {
    // REMOVE THIS BLOCK FOR TESTING PUBLIC ACCESS (Scenario B)
    // const session = await this.authService.getSession();
    // if (!session) {
    //   throw new Error('Not authenticated');
    // }

    const response = await fetch(`${environment.supabaseUrl}/functions/v1/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // REMOVE THIS LINE FOR TESTING PUBLIC ACCESS (Scenario B)
        // 'Authorization': `Bearer ${session.access_token}` // Authenticated admin
      },
      body: JSON.stringify({
        email,
        password,
        name,
        role
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create user');
    }

    return result;
  }
}
