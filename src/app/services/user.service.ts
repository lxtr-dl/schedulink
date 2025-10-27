import { Injectable } from '@angular/core';
import { AuthService, AppUser } from './auth.service'; // <-- Import AppUser
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    this.supabase = this.authService.getClient();
  }

  /**
   * Loads the full app profile for the currently logged-in user.
   */
  async loadCurrentUser(): Promise<AppUser | null> {
    // FIX: The function is now called 'getAuthUser'
    const supaUser = await this.authService.getAuthUser(); 
    if (!supaUser) {
      console.log('No auth user found, cannot load profile.');
      return null;
    }

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('uid', supaUser.id)
      .single();

    if (error) {
      console.error('Error loading current user profile:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Gets all users from the 'users' table (for admin lists).
   */
  async getAllUsers() {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
    return data;
  }

  /**
   * Calls the Edge Function to create a new user/member.
   * This is called by members.page.ts
   */
  async addUser(newMember: any) {
    
    // This log is important for debugging in your BROWSER console (F12)
    console.log('UserService: Calling function "create-member" with payload:', newMember);

    const { data, error } = await this.supabase.functions.invoke('register-member', {
      body: {
        email: newMember.email,
        password: newMember.password,
        name: newMember.name,
        roles: newMember.roles // This is the array of role strings
      }
    });

    if (error) {
      console.error('UserService: Error invoking function:', error);
      return { success: false, error: error };
    }
    
    console.log('UserService: Function returned success:', data);
    return { success: true, data: data };
  }

  // NOTE: I have removed the old 'createUser' function.
  // It was calling 'supabase.auth.admin.createUser', which fails from the app.
  // The 'addUser' function above is the correct one to use.
}