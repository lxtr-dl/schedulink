import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

// --- MOCK DATA & INTERFACES ---

// Represents a single user
interface Member {
  id: string; // e.g., 'user-uuid-1'
  name: string;
}

// Represents a single role assignment
interface RoleAssignment {
  role: string; // e.g., 'Worship Leader'
  assignedMemberId: string | null; // The ID of the assigned member
}

// Represents a full Sunday lineup
interface SundayLineup {
  date: string; // e.g., 'Sunday, June X'
  assignments: RoleAssignment[];
  // --- Internal state ---
  isExpanded?: boolean; // Controls the accordion
  editMode?: boolean; // Toggles view/edit
  editableAssignments?: RoleAssignment[]; // A copy for editing
}

// Mock list of ALL members in the church
const MOCK_ALL_MEMBERS: Member[] = [
  { id: 'user1', name: 'Nny James' },
  { id: 'user2', name: 'Bro. Alence' },
  { id: 'user3', name: 'Sis. Jolina' },
  { id: 'user4', name: 'Bro. Sef' },
  { id: 'user5', name: 'Sis. Ann' },
  { id: 'user6', name: 'Bro. Mark' },
  { id: 'user7', name: 'Bro. Jason' },
  { id: 'user8', name: 'Bro. Arthur' },
];

// Mock list of ALL roles available to be filled
const ALL_ROLES: string[] = [
  'Worship Leader', 'Backup', 'Main Keyboard', 'Pads',
  'Electric Guitar', 'Acoustic Guitar', 'Bass Guitar', 'Drums', 'Multimedia'
];

// Mock data for the next 4 Sundays
const MOCK_MANAGEABLE_SCHEDULES: SundayLineup[] = [
  {
    date: 'Sunday, June X',
    assignments: [
      { role: 'Worship Leader', assignedMemberId: 'user3' },
      { role: 'Backup', assignedMemberId: 'user4' },
      { role: 'Main Keyboard', assignedMemberId: 'user1' },
      { role: 'Pads', assignedMemberId: 'user6' },
      { role: 'Electric Guitar', assignedMemberId: 'user1' },
      { role: 'Acoustic Guitar', assignedMemberId: 'user2' },
      { role: 'Bass Guitar', assignedMemberId: 'user2' },
      { role: 'Drums', assignedMemberId: 'user7' },
      { role: 'Multimedia', assignedMemberId: 'user8' },
    ]
  },
  {
    date: 'Sunday, July X',
    assignments: [
      { role: 'Worship Leader', assignedMemberId: 'user1' },
      { role: 'Backup', assignedMemberId: 'user5' },
      { role: 'Main Keyboard', assignedMemberId: 'user6' },
      { role: 'Pads', assignedMemberId: null }, // Unassigned
      { role: 'Electric Guitar', assignedMemberId: null }, // Unassigned
      { role: 'Acoustic Guitar', assignedMemberId: 'user3' },
      { role: 'Bass Guitar', assignedMemberId: 'user4' },
      { role: 'Drums', assignedMemberId: 'user7' },
      { role: 'Multimedia', assignedMemberId: 'user8' },
    ]
  },
  // We'll auto-fill the empty ones
  { date: 'Sunday, July Y', assignments: [] }, 
  { date: 'Sunday, July Z', assignments: [] },
];

// --- COMPONENT ---

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.page.html',
  styleUrls: ['./manage-roles.page.scss'],
  // Make it standalone and add imports
  standalone: true, 
  imports: [
    IonicModule,
    CommonModule,
    FormsModule 
  ]
})
export class ManageRolesPage implements OnInit {

  schedules: SundayLineup[] = [];
  allMembers: Member[] = MOCK_ALL_MEMBERS;

  constructor() { }

  ngOnInit() {
    // ✅ THIS IS THE FIX: Populate the schedules array
    this.schedules = MOCK_MANAGEABLE_SCHEDULES; 
    
    // Ensure default assignments exist for empty schedules
    this.schedules.forEach(schedule => {
      if (!schedule.assignments || schedule.assignments.length === 0) {
        schedule.assignments = this.createDefaultAssignments();
      }
      // Initialize internal state
      schedule.isExpanded = false;
      schedule.editMode = false;
    });
  }

  // --- Helper Functions ---

  // Creates a default, unassigned lineup
  createDefaultAssignments(): RoleAssignment[] {
    return ALL_ROLES.map(role => ({ role: role, assignedMemberId: null }));
  }

  // Gets the name of the assigned member from their ID
  getMemberName(memberId: string | null): string {
    if (!memberId) return 'Unassigned';
    return this.allMembers.find(m => m.id === memberId)?.name || 'Unknown';
  }

  // --- UI Functions ---

  toggleExpand(schedule: SundayLineup) {
    schedule.isExpanded = !schedule.isExpanded;
    // When collapsing, always turn off edit mode
    if (!schedule.isExpanded) {
      schedule.editMode = false;
    }
  }

  toggleEditMode(schedule: SundayLineup) {
    schedule.editMode = !schedule.editMode;
    if (schedule.editMode) {
      // Create a deep copy of the assignments to edit safely
      schedule.editableAssignments = JSON.parse(JSON.stringify(schedule.assignments));
    } else {
      schedule.editableAssignments = undefined;
    }
  }

  onSave(schedule: SundayLineup) {
    // In a real app, you'd save `schedule.editableAssignments` to Supabase
    console.log('Saving:', schedule.editableAssignments);

    // Update the main assignments with the edited ones
    schedule.assignments = schedule.editableAssignments!;
    schedule.editMode = false;
    schedule.editableAssignments = undefined;
  }

  onCancel(schedule: SundayLineup) {
    // Discard changes
    schedule.editMode = false;
    schedule.editableAssignments = undefined;
  }

}