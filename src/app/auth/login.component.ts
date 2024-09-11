import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <input matInput placeholder="Username" [(ngModel)]="username" name="username" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput type="password" placeholder="Password" [(ngModel)]="password" name="password" required>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 300px;
      margin: 0 auto;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }
  `],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.status === 200 && !!response.body.token) {
          this.router.navigate(['/tasks']);
        } else {
          console.error('Login failed: Invalid response');
        }
      },
      error: (error) => {
        if (error.status === 401) {
          console.error('Login failed: Invalid username or password');
          // Handle invalid credentials (show message to user)
        } else {
          console.error('Login failed', error);
          // Handle other errors (show message to user)
        }
      }
    });
  }
}