// 1. Import OnInit
import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true, // ✅ 3. Add standalone: true
  imports: [ IonicModule, CommonModule, FormsModule ]
})
export class HomePage implements OnInit, OnDestroy { // 4. Implement OnInit/OnDestroy

  // ✅ 5. Move lineup to be a class property
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

  // Properties to hold your data
  userRoles: string[] = [];
  userPositions: string[] = [];
  private subscriptions = new Subscription();

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // ✅ 6. Subscribe to the observables to get the data
    this.subscriptions.add(
      this.authService.currentUserRoles$.subscribe(roles => {
        this.userRoles = roles;
        console.log('Loaded Roles:', this.userRoles);
      })
    );
    
    this.subscriptions.add(
      this.authService.currentUserPositions$.subscribe(positions => {
        this.userPositions = positions;
        console.log('Loaded Positions:', this.userPositions);
      })
    );
  }

  ngOnDestroy() {
    // 7. Unsubscribe to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  // ✅ 8. Move getBadgeColor to be a class method
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
}