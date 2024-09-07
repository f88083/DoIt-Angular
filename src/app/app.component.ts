import { Component } from '@angular/core';
import { TaskListComponent } from './task.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {}