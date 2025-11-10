import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular'; // 1. Import ModalController
import { AuthService } from 'src/app/services/auth.service';
import { CreatePostComponent } from 'src/app/components/create-post/create-post.component'; // 2. Import the modal

// --- Interface for a Post ---
export interface AnnouncementPost {
  id: string;
  author: string;
  avatarUrl: string; // Placeholder for now
  date: string;
  text: string;
  likes: number;
  likedByUser: boolean; // To track the 'like' state
}

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
  standalone: true, // 3. Make it standalone
  imports: [IonicModule, CommonModule, FormsModule] // 4. Add Imports
})
export class AnnouncementsPage implements OnInit {

  // 5. Mock Data based on your Figma
  announcements: AnnouncementPost[] = [
    {
      id: '1',
      author: 'Sis. Jamie',
      avatarUrl: '', // Will use icon placeholder
      date: 'Jul 9, 2025 5:08PM',
      text: 'Goodevening, may changes konti sa time of rehearsal please check nalnag sa schedule',
      likes: 2,
      likedByUser: false
    },
    {
      id: '2',
      author: 'Bro. Dogie',
      avatarUrl: '',
      date: 'April 27, 2025 5:08PM',
      text: 'bigay mo sakin saber, papatayin ko si wise level 4, tas sabi nila "hindi, mas maganda kung jungle yung saber para one shot" Sabi ko "sure kayo diyan?" sinabi ko eto pa tinanong ko sa teammate "guys sure kayo dyan?". lahat sila nag agree don. ok kung lahat kayo agree, team agreement to, g ako. after after netong game, alam mo ginawa ko? tinawagan ko driver ko "👍uwi na tayo pangasinan".',
      likes: 3,
      likedByUser: true // This one will start as "liked"
    }
  ];

  constructor(
    public authService: AuthService, // Make public for the *ngIf
    private modalCtrl: ModalController // For opening the create modal
  ) { }

  ngOnInit() {
  }

  // 6. Logic to toggle the like button
  toggleLike(post: AnnouncementPost) {
    if (post.likedByUser) {
      post.likes--;
      post.likedByUser = false;
    } else {
      post.likes++;
      post.likedByUser = true;
    }
    // In a real app, you would save this change to Supabase
  }

  // 7. Logic to open the "Create Post" modal
  async presentCreateModal() {
    const modal = await this.modalCtrl.create({
      component: CreatePostComponent, // The component we just generated
    });

    await modal.present();

    // Get data back from modal when it closes
    const { data, role } = await modal.onWillDismiss();
    if (role === 'create' && data) {
      // Add the new post to the top of the list
      this.announcements.unshift(data);
    }
  }
}