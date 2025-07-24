import { Component } from '@angular/core'; // Removed OnInit as it's not used in your provided code
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor and *ngIf
import { IonicModule } from '@ionic/angular';   // Import IonicModule for all Ionic components

// Your specific imports for mock data and model
import { MOCK_SCHEDULES } from 'src/app/data/mock-schedules';
import { WeeklySchedule } from 'src/app/models/schedule.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: true, // Crucial for standalone components to use direct imports
  imports: [
    CommonModule, // Required for *ngFor and *ngIf directives in the template
    IonicModule   // Required for all Ionic UI components (ion-header, ion-content, ion-list, ion-card, ion-badge, etc.)
  ]
})
export class SchedulePage { // Removed OnInit interface as ngOnInit is not present
  schedules: WeeklySchedule[] = MOCK_SCHEDULES; // Using your MOCK_SCHEDULES
  expandedWeeks: string[] = [];

  // Your existing toggleWeek logic
  toggleWeek(date: string) {
    const index = this.expandedWeeks.indexOf(date);
    index > -1 ? this.expandedWeeks.splice(index, 1) : this.expandedWeeks.push(date);
  }

  // Your existing getStatusColor logic, including 'unavailable'
  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'unavailable': return 'danger'; // Keep your specific 'unavailable' case
      default: return 'medium';
    }
  }
}