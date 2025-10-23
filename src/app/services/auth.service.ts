// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { 
  createClient, 
  SupabaseClient, 
  User, 
  Session, 
  AuthChangeEvent // Make sure AuthChangeEvent is imported
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router'; // Make sure Router is imported

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  // Use BehaviorSubjects to hold and broadcast data
  private currentUserRoles = new BehaviorSubject<string[]>([]);
  private currentUserPositions = new BehaviorSubject<string[]>([]);

  // Create public observables for components to subscribe to
  public currentUserRoles$ = this.currentUserRoles.asObservable();
  public currentUserPositions$ = this.currentUserPositions.asObservable();

  constructor(private router: Router) { // Make sure Router is injected
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // This listener handles redirects on SIGN_IN / SIGN_OUT
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN') {
        console.log('AuthService detected SIGNED_IN, redirecting...');
        this.router.navigate(['/home']);
      } else if (event === 'SIGNED_OUT') {
        this.router.navigate(['/login']);
      }
    });

    // When the app loads, check if there's an existing session and load data
    this.loadUserDataOnStart();
  }

  // Helper to load data on app start
  private async loadUserDataOnStart() {
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session) {
      await this.loadUserData();
    }
  }

  // ✅ Login
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email, password
    });
    if (error) throw error;
    // We await this, but the redirect is handled by the listener
    await this.loadUserData(); 
    return data;
  }

  // ✅ Logout
  async logout() {
    await this.supabase.auth.signOut();
    // Clear the data on logout
    this.currentUserRoles.next([]);
    this.currentUserPositions.next([]);
  }

  // ✅ Load roles and positions
  async loadUserData() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) {
      return; // No user, nothing to load
    }

    const { data: userProfile, error } = await this.supabase
      .from('users')
      .select('role, position') // Only select what you need
      .eq('uid', user.id)
      .single();

    if (error || !userProfile) {
      console.error('User profile load error:', error);
      this.currentUserRoles.next([]); // Broadcast empty array on error
      this.currentUserPositions.next([]);
      return;
    }

    // Broadcast the new data to all subscribers
    this.currentUserRoles.next(userProfile.role || []);
    this.currentUserPositions.next(userProfile.position || []);
  }

  // ======================================================
  // ALL YOUR HELPER METHODS THAT WERE MISSING
  // ======================================================

  // ✅ Get current session
  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  // ✅ Get current user
  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
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

  // ======================================================
  // YOUR CHECK METHODS
  // ======================================================

  hasRole(role: string): boolean {
    // Use getValue() to get the current array from the BehaviorSubject
    return this.currentUserRoles.getValue().includes(role);
  }

  hasPosition(position: string): boolean {
    return this.currentUserPositions.getValue().includes(position);
  }

  isAdmin(): boolean {
    return this.hasRole('music_director') || this.hasRole('coordinator');
  }

  isWorshipLeader(): boolean {
    return this.hasRole('worship_leader');
  }
}