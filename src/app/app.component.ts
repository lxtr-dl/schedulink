import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false, // <--- Ensure this is false or remove it
  // REMOVE THIS ENTIRE 'imports' ARRAY:
  // imports: [
  //   CommonModule,
  //   IonicModule,
  //   FormsModule,
  //   ReactiveFormsModule,
  // ],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Your existing ngOnInit logic remains here.
    this.authService.onAuthChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      if (session) {
        try {
          await this.userService.loadCurrentUser();
          console.log('Current user loaded in app.component:', this.userService.currentUser);
          if (this.router.url === '/login') {
            this.router.navigate(['/home']);
          }
        } catch (error) {
          console.error('Error loading current user on auth change:', error);
          await this.authService.logout();
          this.router.navigate(['/login']);
        }
      } else {
        this.userService.clearCurrentUser();
        console.log('User logged out or session expired. Redirecting to login.');
        this.router.navigate(['/login']);
      }
    });

    try {
      const session = await this.authService.getSession();
      if (session) {
        await this.userService.loadCurrentUser();
        console.log('Initial user loaded in app.component:', this.userService.currentUser);
      } else {
        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    } catch (error) {
      console.error('Error during initial session check:', error);
      await this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}