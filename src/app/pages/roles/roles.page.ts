import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Import ActionSheetButton
import { IonicModule, ActionSheetController, ActionSheetButton } from '@ionic/angular'; 
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// --- NEW DATA INTERFACES ---
interface UserAssignment {
  role: string;
  status: 'pending' | 'confirmed' | 'unavailable' | 'available';
  assignedTo: string | null;
  date: string; // Add date here for the action sheet header
}
interface WeeklyRoleSummary {
  date: string;
  isPrimaryWeek: boolean; // To control the purple/gray card color
  assignments: UserAssignment[];
}
// --- END NEW DATA INTERFACES ---


@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule
  ]
})
export class RolesPage implements OnInit, OnDestroy {
  segment = 'roles';
  private routerSubscription: Subscription | null = null;
  
  // --- NEW MOCK DATA ---
  roleSchedules: WeeklyRoleSummary[] = [
    {
      date: "Sunday, June X",
      isPrimaryWeek: true, 
      assignments: [
        // ✅ 2. FIX: Added the 'date' property to each assignment
        { role: "Electric Guitar", status: "pending", assignedTo: "Bro. Nny James", date: "Sunday, June X" }
      ]
    },
    {
      date: "Sunday, July X",
      isPrimaryWeek: false, 
      assignments: [
        // ✅ 2. FIX: Added the 'date' property to each assignment
        { role: "Backup", status: "available", assignedTo: null, date: "Sunday, July X" } 
      ]
    },
    {
      date: "Sunday, July Y",
      isPrimaryWeek: false,
      assignments: [
        // ✅ 2. FIX: Added the 'date' property to each assignment
        { role: "Backup", status: "pending", assignedTo: "Bro. Nny James", date: "Sunday, July Y" }
      ]
    }
  ];
  // --- END NEW MOCK DATA ---

  constructor(
    private router: Router,
    public authService: AuthService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    // (This segment-switching logic is correct and stays)
    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const urlSegments = event.urlAfterRedirects.split('/');
      const lastSegment = urlSegments[urlSegments.length - 1];
      if (['manage-roles', 'members'].includes(lastSegment)) {
        this.segment = lastSegment;
      } else {
        this.segment = 'roles'; 
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // --- NEW FUNCTIONS ---

  // Helper to get the correct color for the status
  getStatusColor(status: UserAssignment['status']): string {
    switch (status) {
      case 'confirmed':
      case 'available':
        return 'success';
      case 'pending':
        return 'warning';
      case 'unavailable':
        return 'danger';
      default:
        return 'medium';
    }
  }

  // This function will run when the user clicks their status
  async onStatusClick(assignment: UserAssignment) {
    // ✅ 3. FIX: Explicitly type the buttons array
    let buttons: ActionSheetButton[] = [];

    // 1. Determine which buttons to show based on the status
    if (assignment.status === 'pending') {
      buttons = [
        { text: 'Accept', icon: 'checkmark-circle', handler: () => console.log('Accepted') },
        { text: 'Decline', icon: 'close-circle', role: 'destructive', handler: () => console.log('Declined') }
      ];
    } else if (assignment.status === 'available') {
      buttons = [
        { text: 'Volunteer', icon: 'hand-left', handler: () => console.log('Volunteered') },
      ];
    } else if (assignment.status === 'confirmed') {
      buttons = [
        { text: 'Mark as Unavailable', icon: 'close-circle', role: 'destructive', handler: () => console.log('Marked as unavailable') }
      ];
    } else {
      // If 'unavailable' or other, just show a "Close" button
      buttons = [{ text: 'Close', icon: 'close', role: 'cancel' }];
    }

    // Add a universal cancel button
    if (assignment.status !== 'unavailable') {
        buttons.push({ text: 'Cancel', icon: 'close', role: 'cancel' });
    }

    // 2. Create and show the action sheet
    const actionSheet = await this.actionSheetCtrl.create({
      // This line is now error-free
      header: `${assignment.role} - ${assignment.date}`,
      buttons: buttons
    });
    await actionSheet.present();
  }
  
  // --- END NEW FUNCTIONS ---
}