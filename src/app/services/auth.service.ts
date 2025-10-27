import { Injectable, NgZone } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  User,
  Session,
  AuthChangeEvent,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<AppUser | null>(null);
  public currentUser$ = this.currentUser.asObservable();
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  // 1. REMOVE the flag
  // private initialAuthComplete = false; 

  constructor(private router: Router, private zone: NgZone) { 
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`AuthService Listener: Event received - ${event}`); 

      this.zone.run(async () => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (session) {
            console.log(`AuthService Listener: Handling ${event} with session.`);
            try {
              await this.loadUserProfile(session.user);
            } catch (error) {
              console.error('AuthService Listener: Failed to load user profile:', error);
            }

            this.isAuthenticated.next(true);

            // 2. SIMPLIFIED FIX: Only redirect if the specific event is SIGNED_IN
            if (event === 'SIGNED_IN') {
               console.log(`AuthService Listener: Redirecting to /tabs/home due to SIGNED_IN.`);
               this.router.navigate(['/tabs/home']); 
            } else {
               console.log(`AuthService Listener: Not redirecting (${event}).`);
            }
            
          } else {
             console.log(`AuthService Listener: ${event} event, but no session found.`);
             // Reset state if session becomes invalid
             this.currentUser.next(null);
             this.isAuthenticated.next(false);
          }
        } else if (event === 'SIGNED_OUT') {
           console.log(`AuthService Listener: Handling SIGNED_OUT, redirecting to login.`);
           this.currentUser.next(null);
           this.isAuthenticated.next(false);
           this.router.navigate(['/login']);
        }
      });
    });
  }

  // ... (Rest of your AuthService is fine) ...

  async loadUserProfile(authUser: User) {
    if (!authUser) return;
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('uid', authUser.id)
        .single();
      if (error) throw error; 
      console.log('AuthService: Loaded profile data:', data); // Keep this log
      this.currentUser.next(data as AppUser);
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.currentUser.next(null);
      throw error; 
    }
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  private getRoles(): string[] { return this.currentUser.getValue()?.role || []; }
  public can(allowedRoles: string[]): boolean { const userRoles = this.getRoles(); return userRoles.some(role => allowedRoles.includes(role)); }
  public hasRole(role: string): boolean { return this.getRoles().includes(role); }
  public isAdmin(): boolean { return this.can(['Music Director', 'Admin']); }
  public canPostAnnouncement(): boolean { return this.can(['Music Director', 'Admin', 'Worship Leader']); }
  getClient() { return this.supabase; }
  public getCurrentUser(): AppUser | null { return this.currentUser.getValue(); }
  async getAuthUser(): Promise<User | null> { const { data } = await this.supabase.auth.getUser(); return data.user; }
}