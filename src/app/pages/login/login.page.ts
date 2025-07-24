import { Component, OnInit } from '@angular/core'; // Keep OnInit if you use it, or remove if not needed
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { IonicModule } from '@ionic/angular'; // Import IonicModule for all Ionic components

// Keep your existing service imports
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, // This is crucial for fixing the previous NG6008 error and using imports directly
  imports: [
    CommonModule,        // Provides *ngIf
    ReactiveFormsModule, // Provides [formGroup] and formControlName
    IonicModule          // Provides all ion-* components (ion-header, ion-content, ion-input, ion-button, etc.)
  ]
})
export class LoginPage implements OnInit { // Added OnInit for consistency, though your form is in constructor
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    // Initialize form in constructor, as in your original code
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Add ngOnInit if you plan to do any initialization after constructor
  ngOnInit() {
    this.checkSessionAndRedirect();
  }

  async checkSessionAndRedirect() {
    try {
      const session = await this.authService.getSession();
      if (session) {
        this.router.navigate(['/tabs/home']);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  }

  async onLogin() {
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      await this.userService.loadCurrentUser(); // 👈 fetch user roles
      this.router.navigate(['/tabs/home']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Login failed.';
    }
  }
}