import { Component } from '@angular/core';
// Add these three imports
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [ IonicModule, CommonModule, FormsModule ] // <-- Add this line
})
export class HomePage {

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