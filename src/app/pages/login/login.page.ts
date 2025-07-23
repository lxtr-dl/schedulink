import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  async onLogin() {
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      await this.userService.loadCurrentUser(); // 👈 fetch user roles
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Login failed.';
    }
  }
}
