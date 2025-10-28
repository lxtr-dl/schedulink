import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MOCK_SCHEDULES } from 'src/app/data/mock-schedules';
import { WeeklySchedule } from 'src/app/models/schedule.model';
import { RefresherCustomEvent } from '@ionic/angular'; 

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ]
})
export class SchedulePage {
  schedules: WeeklySchedule[] = []; 
  expandedWeeks: string[] = [];
  activeWeekDate: string | null = null; // ✅ 1. Property to hold the active week's date

  constructor(private router: Router) {
     this.loadInitialSchedules(); 
  }

  loadInitialSchedules() {
     console.log('Loading initial schedules...');
     this.schedules = MOCK_SCHEDULES;
     // ✅ 2. Determine the active week (using the first week for now)
     if (this.schedules.length > 0) {
       this.activeWeekDate = this.schedules[0].date; 
       // Later, replace this with logic to find the current/closest week
     } else {
       this.activeWeekDate = null;
     }
  }

  // ✅ 3. Helper function to check if a week is the active one
  isWeekActive(weekDate: string): boolean {
    return weekDate === this.activeWeekDate;
  }

  toggleWeek(date: string) {
    // ... (keep existing logic)
    const index = this.expandedWeeks.indexOf(date);
    index > -1 ? this.expandedWeeks.splice(index, 1) : this.expandedWeeks.push(date);
  }

  getStatusColor(status: string): string {
    // ... (keep existing logic)
     switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'unavailable': return 'danger';
      default: return 'medium';
    }
  }

  async handleRefresh(event: RefresherCustomEvent) {
    // ... (keep existing logic)
     console.log('Refreshing schedules...');
     await this.fetchSchedulesFromBackend();
     // ✅ Re-determine active week after refresh
     if (this.schedules.length > 0) {
       this.activeWeekDate = this.schedules[0].date; 
     } else {
       this.activeWeekDate = null;
     }
     event.target.complete(); 
  }

  async fetchSchedulesFromBackend() {
    // ... (keep existing logic)
     return new Promise(resolve => {
       setTimeout(() => {
          console.log('Simulated fetch complete.');
          this.schedules = [...MOCK_SCHEDULES]; 
          resolve(true);
       }, 1500); 
    });
  }

  goToProfile() {
    // ... (keep existing logic)
  }
}