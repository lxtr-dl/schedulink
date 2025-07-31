import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';

// REMOVE these imports from here:
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
  standalone: false, // <--- Ensure this is false or remove it
  // REMOVE THIS ENTIRE 'imports' ARRAY:
  // imports: [
  //   CommonModule,
  //   ReactiveFormsModule,
  //   IonicModule
  // ]
})
export class RolesPage implements OnInit {
  addUserForm: FormGroup;
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    private toastCtrl: ToastController
  ) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.userService.loadCurrentUser(); // Ensure currentUser is ready
    const roles = this.userService.currentUser?.role ?? [];
    this.isAdmin = roles.includes('music director') || roles.includes('coordinator');
    console.log('User roles:', roles);
    console.log('Is Admin:', this.isAdmin);
  }

  async onAddUser() {
    if (this.addUserForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Please fill all required fields correctly.',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const { name, email, password, role } = this.addUserForm.value;

    try {
      const res = await this.userService.createUserViaEdge(email, password, name, [role]);
      const toast = await this.toastCtrl.create({
        message: res.message,
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.addUserForm.reset();
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message || 'Failed to create user',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}