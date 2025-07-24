export interface RoleAssignment {
  role: string;
  persons: string[];
  status: 'confirmed' | 'pending' | 'unavailable';
}

export interface WeeklySchedule {
  date: string; // e.g. "Sunday, July 28"
  assignments: RoleAssignment[];
  rehearsalDateTime: string;  // e.g. "Saturday 18:00"
  devotionHost: string;       // e.g. "Bro. Alden"
}

