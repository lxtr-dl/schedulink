import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Keep FormBuilder, FormGroup, Validators
import { ToastController } from '@ionic/angular'; // Keep ToastController here as it's injected

// REMOVE these imports from here:
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false, // <--- Ensure this is false or remove it
  // REMOVE THIS ENTIRE 'imports' ARRAY:
  // imports: [
  //   CommonModule,
  //   ReactiveFormsModule,
  //   IonicModule
  // ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.checkSessionAndRedirect();
  }

  async checkSessionAndRedirect() {
    try {
      const session = await this.authService.getSession();
      if (session) {
        console.log('Session found on login page init, redirecting to home.');
        await this.userService.loadCurrentUser();
        this.router.navigate(['/home']);
      } else {
        console.log('No session found on login page init.');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      const toast = await this.toastCtrl.create({
        message: 'Could not check session. Please try logging in.',
        duration: 3000,
        color: 'warning'
      });
      toast.present();
    }
  }

  async onLogin() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email and password.';
      const toast = await this.toastCtrl.create({
        message: this.errorMessage,
        duration: 3000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log('Attempting login with:', email);

    try {
      const { user, session } = await this.authService.login(email, password);

      if (user && session) {
        console.log('Login successful for user:', user.email);
        await this.userService.loadCurrentUser();
        console.log('User profile loaded:', this.userService.currentUser);
        await this.router.navigate(['/home']); // ✅ Add await
        return; // ✅ Stop further execution
      } else {
        this.errorMessage = 'Login failed: Unexpected response from server.';
        const toast = await this.toastCtrl.create({
          message: this.errorMessage,
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        this.errorMessage = 'Invalid email or password.';
      } else if (error.message.includes('Email not confirmed')) {
        this.errorMessage = 'Please confirm your email address.';
      } else {
        this.errorMessage = error.message || 'Login failed. Please try again.';
      }

      const toast = await this.toastCtrl.create({
        message: this.errorMessage,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
}