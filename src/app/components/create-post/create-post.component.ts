import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  standalone: true, // 2. Make it standalone
  imports: [IonicModule, CommonModule, FormsModule] // 3. Add imports
})
export class CreatePostComponent implements OnInit {
  postText: string = '';
  currentUser: any; // To get the author's name

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  // Close the modal without sending data
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Send the new post data back to the page
  onCreatePost() {
    if (!this.postText.trim()) {
      return; // Don't post empty messages
    }

    // Create a new post object
    const newPost = {
      id: new Date().getTime().toString(), // Temporary unique ID
      author: this.currentUser?.name || 'Admin',
      avatarUrl: '', // Add current user avatarUrl later
      date: new Date().toLocaleString(), // Set current date/time
      text: this.postText,
      likes: 0,
      likedByUser: false
    };

    // Close the modal and send the new post data
    this.modalCtrl.dismiss(newPost, 'create');
  }
}