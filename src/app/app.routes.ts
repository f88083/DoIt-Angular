import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { TaskListComponent } from './task.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TaskListComponent},
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
];