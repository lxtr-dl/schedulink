import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ 1. IMPORT
import { IonicModule, ActionSheetController } from '@ionic/angular'; // ✅ 2. IMPORT
import { FormsModule } from '@angular/forms'; // ✅ 3. IMPORT
import { AuthService } from 'src/app/services/auth.service';

// --- MOCK DATA AND INTERFACES (based on your Figma) ---
interface Song {
  id: string;
  title: string;
  artist?: string;
  youtubeLink?: string;
  chordsLink?: string;
  key?: string; 
}

interface LineUpItem {
  category: string;
  suggestion?: boolean;
  songs: Song[];
}

interface SundayLineUp {
  date: string;
  items: LineUpItem[];
  rehearsalDay?: string;
  rehearsalTime?: string;
}

// Mock data for the "All Songs" list (for the dropdown)
const MOCK_SONGS_LIST: Song[] = [
  { id: '1', title: '10,000 Reasons', artist: 'Matt Redman' },
  { id: '2', title: 'Always On Time', artist: 'Elevation Worship' },
  { id: '3', title: 'Amazing Grace', artist: 'Chris Tomlin' },
  { id: '4', title: 'Goodness of God', artist: 'Bethel Music' },
  { id: '5', title: 'What a Beautiful Name', artist: 'Hillsong' },
  { id: '6', title: 'Been So Good', artist: 'Elevation Worship' },
];

// Mock data for the "This Sunday" view
const MOCK_THIS_SUNDAY_LINEUP: SundayLineUp = {
  date: 'Sunday, June X',
  items: [
    { category: 'Welcome song', suggestion: true, songs: [{ id: '2', title: 'Always On Time' }] }, // Use simple object for edit mode
    { category: 'Call To Worship', songs: [{ id: '3', title: 'Amazing Grace' }] },
    { category: 'Praise', songs: [{ id: '1', title: '10,000 Reasons' }, { id: '5', title: 'What a Beautiful Name' }] },
    { category: 'Worship', songs: [{ id: '4', title: 'Goodness of God' }, { id: '6', title: 'Been So Good', artist: 'Elevation Worship' } ] },
    { category: 'Offertory', suggestion: true, songs: [{ id: '2', title: 'Always On Time' }] },
  ],
  rehearsalDay: 'Saturday',
  rehearsalTime: '08:00 AM'
};
// --- END MOCK DATA ---


@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
  standalone: true, // ✅ 4. THIS IS THE KEY
  imports: [
    CommonModule,   // For *ngIf, *ngFor
    FormsModule,    // For [(ngModel)]
    IonicModule     // For all ion- tags
  ] // ✅ 5. ADD THIS IMPORTS ARRAY
})
export class MusicPage implements OnInit {
  selectedSegment: string = 'this-sunday'; // Default segment

  currentSundayLineUp: SundayLineUp = MOCK_THIS_SUNDAY_LINEUP;
  allSongs: Song[] = MOCK_SONGS_LIST; // For dropdowns
  
  // This will be used to edit, so we don't mess up the original data
  editableLineUp!: SundayLineUp; 

  isWorshipLeaderScheduled: boolean = false; // Default to false
  editMode: boolean = false;

  constructor(
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    // ✅ Check user's role
    // We simulate that this user is the scheduled WL
    if (this.authService.hasRole('Worship Leader')) {
      this.isWorshipLeaderScheduled = true; 
    }
    // In the future, you'll also check if they are scheduled for *this* Sunday
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      // Create a deep copy of the lineup to edit
      this.editableLineUp = JSON.parse(JSON.stringify(this.currentSundayLineUp));
    }
  }

  onSaveLineUp() {
    // Here, you would save 'this.editableLineUp' to Supabase
    console.log('Saving lineup:', this.editableLineUp);
    
    // For now, just update the main lineup and exit edit mode
    // We need to map the song IDs back to full song objects for the view
    this.editableLineUp.items.forEach(item => {
      // Find the full song object from our master list based on the ID
      // Handle potential undefined item.songs[0]
      const selectedSongId = item.songs[0]?.id; 
      const fullSong = this.allSongs.find(song => song.id === selectedSongId);
      // Replace the simple song object with the full one
      item.songs = fullSong ? [fullSong] : [];
    });
    
    this.currentSundayLineUp = this.editableLineUp; 
    this.editMode = false;
  }

  onCancelEdit() {
    // Discard changes and exit edit mode
    this.editableLineUp = null!;
    this.editMode = false;
  }

  async onSongClick(song: Song) {
    console.log('Clicked song:', song);
    // Show an Action Sheet with options
    const actionSheet = await this.actionSheetCtrl.create({
      header: song.title,
      buttons: [
        {
          text: 'Open YouTube Link',
          icon: 'logo-youtube',
          handler: () => {
            console.log('Open YouTube');
            // Add logic to open song.youtubeLink in a browser
            // e.g., if (song.youtubeLink) window.open(song.youtubeLink, '_blank');
          }
        },
        {
          text: 'Save to Song Book',
          icon: 'bookmark-outline',
          handler: () => {
            console.log('Save to Song Book');
            // Add logic to save this song to user's favorites
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}