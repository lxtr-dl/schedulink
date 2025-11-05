import { Component, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, AppUser } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TabsPage implements OnDestroy {
  pageTitle: string = 'Home'; // Default title
  currentUser: AppUser | null = null;
  private userSub: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Subscribe to user data (for profile pic later)
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('TabsPage: Current user loaded for profile icon', this.currentUser);
    });
  }

  // This function runs when the user clicks a tab
  handleTabsDidChange(event: any) {
    const tab = event.tab;
    switch (tab) {
      case 'home':
        this.pageTitle = 'Home';
        break;
      case 'schedule':
        this.pageTitle = 'Schedules';
        break;
      case 'roles':
        this.pageTitle = 'Roles & Volunteers';
        break;
      case 'music':
        this.pageTitle = 'Line-Up';
        break;
      case 'announcements':
        this.pageTitle = 'News';
        break;
      default:
        this.pageTitle = 'Home'; // Fallback
    }
  }

  // This function runs when the profile icon is clicked
  goToProfile() {
    console.log('Navigating to profile menu...');
    // We will create this '/profile' page next
    this.router.navigate(['/profile']); 
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
