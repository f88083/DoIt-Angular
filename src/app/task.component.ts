import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-list',
  template: `
    <h1>Task List</h1>
    <button (click)="loadTasks()">Get All Tasks</button>
    <ul *ngIf="tasks.length > 0">
      <li *ngFor="let task of tasks">{{ task.title }}</li>
    </ul>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TaskListComponent {
  tasks: any[] = [];

  constructor(private taskService: TaskService) { }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        console.log('Tasks loaded:', this.tasks);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }
}