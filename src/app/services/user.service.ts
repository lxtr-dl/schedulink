// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    this.supabase = this.authService.getClient();
  }

  // ✅ Load currently logged-in user's full profile
  async loadCurrentUser() {
    const supaUser = await this.authService.getUser();
    if (!supaUser) throw new Error('User not found in auth.');

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('uid', supaUser.id)
      .single();

    if (error) throw error;
    return data;
  }

  // ✅ Admin creates a new user (works directly with Supabase Auth)
  async createUser(email: string, password: string, name: string, roles: string[], positions: string[]) {
    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;

    const uid = authUser.user?.id;

    // Then add their info to your custom "users" table
    const { error: insertError } = await this.supabase
      .from('users')
      .insert({
        uid,
        name,
        email,
        role: roles,
        position: positions
      });

    if (insertError) throw insertError;

    return authUser;
  }
}
