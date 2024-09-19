import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showSnackbar } from '../shared/snackbar-utils';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <input matInput placeholder="Username" [(ngModel)]="username" name="username" required>
          <mat-error *ngIf="!username">username is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput type="password" placeholder="Password" [(ngModel)]="password" name="password" required>
          <mat-error *ngIf="!password">password is required</mat-error>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="!username || !password">Login</button>
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
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  duration: number = 3; // Snack bar show duration

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  onSubmit() {
    // Prevent invalid login
    if (!this.username || !this.password) return;

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        showSnackbar(this.snackBar, 'Login successful');
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        if (error.status === 401) {
          showSnackbar(this.snackBar, 'Login failed: Invalid username or password');
        } else {
          console.error('Login failed', error);
          showSnackbar(this.snackBar, 'An error occurred during login');
        }
      }
    });
  }
}