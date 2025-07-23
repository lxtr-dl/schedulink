import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user'; // 👈 Make sure this file exists
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;
  private _currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.supabase = this.authService.getClient();
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
}
