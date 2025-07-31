import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // ✅ Login
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  // ✅ Logout
  async logout() {
    await this.supabase.auth.signOut();
  }

  // ✅ Get current session
  // Your current getSession() in AuthService
async getSession() {
    const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const { data: userData, error: userError } = await this.supabase.auth.getUser(); // <-- You're also getting the user here
    if (userError || !userData?.user) return null; // <-- If no user, it returns null here

    return sessionData.session; // <-- You return only the session object (or null)
}

  // ✅ Get current user
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  // ✅ Optional: Listen for auth state changes
  onAuthChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // 🔐 Expose supabase client if needed by other services
  getClient() {
    return this.supabase;
  }
}
