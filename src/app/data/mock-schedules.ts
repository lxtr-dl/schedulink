import { WeeklySchedule } from '../models/schedule.model';

export const MOCK_SCHEDULES: WeeklySchedule[] = [
  {
    date: 'Sunday, July 27',
    assignments: [
      { role: 'Worship Leader', persons: ['Sis. Jolina'], status: 'confirmed' },
      { role: 'Backup', persons: ['Bro. Ken', 'Sis. Ann'], status: 'confirmed' },
      { role: 'Main Keyboard', persons: ['Bro. RJ'], status: 'pending' },
      { role: 'Pads', persons: ['Bro. Mark'], status: 'confirmed' },
      { role: 'Electric Guitar', persons: ['Bro. Nvy James'], status: 'unavailable' },
      { role: 'Bass Guitar', persons: ['Sis. IG'], status: 'pending' },
      { role: 'Acoustic Guitar', persons: ['Bro.n James'], status: 'unavailable' },
      { role: 'Drums', persons: ['Bro. Jason'], status: 'confirmed' },
    ],
    rehearsalDateTime: 'Saturday 10:00',
    devotionHost: 'Sis. Kim'
  },
  {
    date: 'Sunday, August 3',
    assignments: [
      { role: 'Worship Leader', persons: ['Bro. Set'], status: 'pending' },
      { role: 'Backup', persons: ['Sis. Nicole'], status: 'pending' },
      { role: 'Main Keyboard', persons: ['Bro. RJ'], status: 'confirmed' },
      { role: 'Pads', persons: ['Bro. Mark'], status: 'confirmed' },
      { role: 'Electric Guitar', persons: ['Bro. Nvy James'], status: 'unavailable' },
      { role: 'Bass Guitar', persons: ['Sis. IG'], status: 'pending' },
      { role: 'Acoustic Guitar', persons: ['Bro.n James'], status: 'unavailable' },
      { role: 'Drums', persons: ['Bro. Jason'], status: 'confirmed' },
    ],
    rehearsalDateTime: 'Saturday 18:00',
    devotionHost: 'Bro. Lotlot'
  },
  {
    date: 'Sunday, August 10',
    assignments: [
      { role: 'Worship Leader', persons: ['Sis. Lani'], status: 'pending' },
      { role: 'Backup', persons: ['Bro. Ken', 'Sis. Ann'], status: 'confirmed' },
      { role: 'Main Keyboard', persons: ['Bro. RJ'], status: 'pending' },
      { role: 'Pads', persons: ['Bro. Mark'], status: 'confirmed' },
      { role: 'Electric Guitar', persons: ['Bro. Nvy James'], status: 'unavailable' },
      { role: 'Bass Guitar', persons: ['Sis. IG'], status: 'pending' },
      { role: 'Acoustic Guitar', persons: ['Bro.n James'], status: 'unavailable' },
      { role: 'Drums', persons: ['Bro. Jason'], status: 'confirmed' },
    ],
    rehearsalDateTime: 'Saturday 9:00',
    devotionHost: 'Sis. ter'
  },
  {
    date: 'Sunday, August 17',
    assignments: [
      { role: 'Worship Leader', persons: ['Sis. Marj'], status: 'pending' },
      { role: 'Backup', persons: ['Bro. Ken', 'Sis. Ann'], status: 'confirmed' },
      { role: 'Main Keyboard', persons: ['Bro. RJ'], status: 'pending' },
      { role: 'Pads', persons: ['Bro. Mark'], status: 'confirmed' },
      { role: 'Electric Guitar', persons: ['Bro. Nvy James'], status: 'unavailable' },
      { role: 'Bass Guitar', persons: ['Sis. IG'], status: 'pending' },
      { role: 'Acoustic Guitar', persons: ['Bro.n James'], status: 'unavailable' },
      { role: 'Drums', persons: ['Bro. Jason'], status: 'confirmed' },
    ],
    rehearsalDateTime: 'Saturday 18:00',
    devotionHost: 'Sis. Kim'
  }
];
