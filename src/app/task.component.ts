import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';
import { Task } from './models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="todo-container">
      <div class="header">
        <h1>My Tasks</h1>
        <button class="create-button" (click)="openCreateTaskDialog()">+ New Task</button>
      </div>
      <ul class="task-list">
        <li *ngFor="let task of tasks" class="task-item">
          <div class="task-header">
            <label>
              <input type="checkbox" [checked]="task.completed" (change)="toggleTask(task)">
              <span [class.completed]="task.completed">{{ task.title }}</span>
            </label>
            <button (click)="task.showDescription = !task.showDescription">
              {{ task.showDescription ? '▲' : '▼' }}
            </button>
          </div>
          <p *ngIf="task.showDescription" class="task-description">{{ task.description }}</p>
          <p *ngIf="task.showDescription" class="task-description">{{ task.status }}</p>
          <p *ngIf="task.showDescription" class="task-description">{{ task.dueDate | date }}</p>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
    .todo-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .task-list { list-style-type: none; padding: 0; }
    .task-item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .task-header { display: flex; justify-content: space-between; align-items: center; }
    .completed { text-decoration: line-through; color: #888; }
    .task-description { margin-top: 5px; font-size: 0.9em; color: #666; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .create-button { 
      background-color: #0078d4; 
      color: white; 
      border: none; 
      padding: 10px 15px; 
      border-radius: 4px; 
      cursor: pointer; 
    }
  `
  ],
  standalone: true,
  imports: [CommonModule]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  // Load tasks when the component is initialized
  ngOnInit() {
    this.loadTasks();
  }

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

  toggleTask(task: Task) {
    task.completed = !task.completed;
  }

  openCreateTaskDialog() {
    // Implement the logic to open a dialog or navigate to a create task page
    console.log('Open create task dialog');
  }
}