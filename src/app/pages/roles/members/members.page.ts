import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

// Define an interface for better type safety
interface Role {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})
export class MembersPage implements OnInit {
  members: any[] = [];
  newMember = { name: '', email: '', password: '', roles: [] as string[] };

  // 3. UPDATED: availableRoles now matches your new list
  availableRoles: Role[] = [
    // Admin-level roles
    { name: 'Music Director', selected: false },
    { name: 'Admin', selected: false }, // <-- ADDED
    
    // Special permission roles
    { name: 'Worship Leader', selected: false },

    // Member-level roles
    { name: 'Backup', selected: false },
    { name: 'Main Keyboard', selected: false },
    { name: 'Pads', selected: false },
    { name: 'Electric Guitar', selected: false },
    { name: 'Bass Guitar', selected: false },
    { name: 'Acoustic Guitar', selected: false },
    { name: 'Drummer', selected: false },
    { name: 'Multimedia', selected: false },
  ];

  constructor(
    private userService: UserService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.loadMembers();
  }

  async loadMembers() {
    this.members = await this.userService.getAllUsers();
  }

  async addMember() {
    if (!this.newMember.email || !this.newMember.password) return;

    // Map the selected roles back to an array of string names
    this.newMember.roles = this.availableRoles
      .filter(role => role.selected)
      .map(role => role.name);

    // Call the Edge Function
    const { success, error } = await this.userService.addUser(this.newMember);

    if (success) {
      this.presentToast('Member added successfully');
      this.newMember = { name: '', email: '', password: '', roles: [] };
      this.availableRoles.forEach(role => role.selected = false);
      this.loadMembers();
    } else {
      this.presentToast(error?.message || 'Failed to add member');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}