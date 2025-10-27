import { Injectable, NgZone } from '@angular/core'; // 1. Import NgZone
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

  // 2. Inject NgZone in the constructor
  constructor(private router: Router, private zone: NgZone) { 
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      // 3. Wrap the logic inside this.zone.run()
      // This forces Angular to see the changes.
      this.zone.run(async () => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (session) {
            try {
              await this.loadUserProfile(session.user);
            } catch (error) {
              console.error('Failed to load user profile in listener:', error);
            }

            this.isAuthenticated.next(true);

            if (event === 'SIGNED_IN') {
              this.router.navigate(['/tabs/home']); // This is your correct path
            }
          }
        } else if (event === 'SIGNED_OUT') {
          this.currentUser.next(null);
          this.isAuthenticated.next(false);
          this.router.navigate(['/login']);
        }
      });
    });
  }

  // ... (The rest of your file is PERFECT, no more changes needed) ...

  async loadUserProfile(authUser: User) {
    if (!authUser) return;

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('uid', authUser.id)
        .single();

      if (error) throw error; // This error will be caught by the listener
      this.currentUser.next(data as AppUser);

    } catch (error) {
      console.error('Error loading user profile:', error);
      this.currentUser.next(null);
      throw error; // Re-throw to be caught by the listener
    }
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  private getRoles(): string[] {
    return this.currentUser.getValue()?.role || [];
  }
  
  public can(allowedRoles: string[]): boolean {
    const userRoles = this.getRoles();
    return userRoles.some(role => allowedRoles.includes(role));
  }
  
  public hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
  
  public isAdmin(): boolean {
    return this.can(['Music Director', 'Admin']);
  }
  
  public canPostAnnouncement(): boolean {
    return this.can(['Music Director', 'Admin', 'Worship Leader']);
  }
  
  getClient() {
    return this.supabase;
  }
  
  public getCurrentUser(): AppUser | null {
    return this.currentUser.getValue();
  }
  
  async getAuthUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }
}