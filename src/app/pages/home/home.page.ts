// 1. Import OnInit, OnDestroy
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 2. Import AuthService AND the AppUser interface
import { AuthService, AppUser } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs'; // 3. Import Subscription

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit, OnDestroy {
  // ✅ Your lineup property
  lineup = [
    { role: 'Worship Leader', status: 'confirmed' },
    { role: 'Backup 3/5', status: 'confirmed' },
    { role: 'Main Keyboard', status: 'pending' },
    { role: 'Pads', status: 'confirmed' },
    { role: 'Electric guitar', status: 'unavailable' },
    { role: 'Acoustic guitar', status: 'confirmed' },
    { role: 'Bass guitar', status: 'confirmed' },
    { role: 'Drums', status: 'confirmed' },
    { role: 'Multimedia', status: 'confirmed' },
  ];

  // ✅ Property to hold the full user profile
  currentUser: AppUser | null = null;
  private subscriptions = new Subscription();

  // Make authService public so your template can use it
  constructor(public authService: AuthService) {}

  ngOnInit() {
    // ✅ 4. THIS IS THE FIX
    // Subscribe to the new, single 'currentUser$' observable
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user) => {
        // 'user' is the entire AppUser object (or null)
        this.currentUser = user;
        console.log('Loaded User Profile:', this.currentUser);

        // You can get the roles from the user object if needed
        const roles = user ? user.role : [];
        console.log('Loaded Roles:', roles);
      })
    );

    // We no longer need to subscribe to 'currentUserPositions$'
    // because you deleted that column.
  }

  ngOnDestroy() {
    // 5. Unsubscribe to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  // ✅ Your getBadgeColor method
  getBadgeColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'unavailable':
        return 'danger';
      default:
        return 'medium';
    }
  }

  // ✅ Your logout method
  async logout() {
    await this.authService.logout();
  }
}