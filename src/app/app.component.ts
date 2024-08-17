import { Component } from '@angular/core';
import { TaskListComponent } from './task.component';

@Component({
  selector: 'app-root',
  template: '<app-task-list></app-task-list>',
  standalone: true,
  imports: [TaskListComponent]
})
export class AppComponent {}