import { Component, OnInit } from '@angular/core';
import { AuthService, AppUser } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular'; // ✅ 1. Import IonicModule
import { CommonModule } from '@angular/common'; // ✅ 2. Import CommonModule

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true, // ✅ 3. Add standalone flag
  imports: [
    IonicModule,  // ✅ 4. Import IonicModule here
    CommonModule  // ✅ 5. Import CommonModule here (for *ngIf, etc. later)
  ]
})
export class ProfilePage implements OnInit {
  
  currentUser: AppUser | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Load current user data for display
    this.currentUser = this.authService.getCurrentUser();
  }

  // --- Placeholder Functions ---
  onAccountSettings() {
    console.log('Clicked Account Settings');
    // this.router.navigate(['/profile/settings']); // Example
  }
  onNotification() {
    console.log('Clicked Notification');
  }
  onAppReferences() {
    console.log('Clicked App References');
  }
  onSupport() {
    console.log('Clicked Support');
  }

  // --- Logout Function ---
  onLogout() {
    console.log('Logging out...');
    // Add a confirmation alert later
    this.authService.logout();
    // AuthService will handle redirecting to /login
  }
}
