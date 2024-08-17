import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-list',
  template: `
    <div class="todo-container">
      <h1>My Tasks</h1>
      <ul class="task-list">
        <li *ngFor="let task of tasks" class="task-item">
          <label>
            <input type="checkbox" (change)="toggleTask(task)">
            <span [class.completed]="task.completed">{{ task.title }}</span>
          </label>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
    .todo-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .task-list { list-style-type: none; padding: 0; }
    .task-item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .completed { text-decoration: line-through; color: #888; }
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
    // Here typically update the task on the server
  }
}