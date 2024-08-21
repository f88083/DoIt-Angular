import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';
import { Task, TaskCreateRequest } from './models/task.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from './task-create.component';
import { EditTaskDialogComponent } from './task-edit.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="todo-container">
      <div class="header">
        <h1>Do It!</h1>
        <button class="create-button" (click)="openCreateTaskDialog()">+ New Task</button>
      </div>
      <ul class="task-list">
        <li *ngFor="let task of tasks" class="task-item">
          <div class="task-header">
            <div class="task-title">
              <mat-checkbox
                     [checked]="task.status === 1" 
                     (change)="completeTask(task)"
                     (click)="$event.stopPropagation()"
                     class="task-checkbox"
                     color="primary">
              </mat-checkbox>
              <div class="task-info">
                <span [class.status]="task.status" (click)="openEditTaskDialog(task)">{{ task.title }}</span>
                <span class="due-date">{{ task.dueDate | date }}</span>
              </div>
            </div>
            <button class="task-show-description-btn" mat-icon-button
                    (click)="task.showDescription = !task.showDescription; $event.stopPropagation()">
                <mat-icon *ngIf="task.showDescription; else nodescription">expand_less</mat-icon>
                <ng-template #nodescription>
                  <mat-icon>
                    expand_more
                  </mat-icon>
                </ng-template>
            </button>
          </div>
          <p *ngIf="task.showDescription" class="task-description">{{ task.description }}</p>
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
    .status { text-decoration: line-through; color: #888; }
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
    .task-title {
      display: flex;
      align-items: center;
    }
    .task-checkbox {
      margin-right: 10px;
    }
    .task-info {
      display: flex;
      flex-direction: column;
    }
    .due-date {
      font-size: 0.8em;
      color: #888;
      margin-top: 2px;
    }
    .task-show-description-btn{
      
    }
  `
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    CreateTaskDialogComponent,
    EditTaskDialogComponent,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  // Load tasks when the component is initialized
  ngOnInit() {
    this.loadTasks();
    setInterval(() => this.deleteCompletedTasks(), 5000); // Check every 5 seconds
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

  // Mark task as completed or not completed
  completeTask(task: Task) {
    // Change the status of the task
    task.status = task.status === 0 ? 1 : 0;
    this.taskService.updateTask(task.taskId, task).subscribe({
      next: (updatedTask) => {
        console.log('Task updated:', updatedTask);
        // Update the task in the local array
        const index = this.tasks.findIndex(t => t.taskId === updatedTask.taskId);
        // If the task is found, update it
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
        // Revert the change if the update fails
        task.status = task.status === 0 ? 1 : 0;
      }
    });
  }

  // Actually delete completed tasks
  deleteCompletedTasks() {
    const completedTasks = this.tasks.filter(task => task.status === 1);
    completedTasks.forEach(task => {
      this.taskService.deleteTask(task.taskId).subscribe({
        next: () => {
          console.log(`Task ${task.taskId} deleted successfully`);
          this.tasks = this.tasks.filter(t => t.taskId !== task.taskId);
        },
        error: (error) => {
          console.error(`Error deleting task ${task.taskId}:`, error);
        }
      });
    });
  }

  openCreateTaskDialog() {
    // open a dialog to create a new task
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '400px',
      // You can add more dialog configuration here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create a new task
        const newTask: TaskCreateRequest = {
          title: result.title,
          description: result.description,
          status: result.status,
          dueDate: result.dueDate
        };

        this.taskService.createTask(newTask).subscribe(() => {
          //TODO: handle potential error
          this.loadTasks();
        });
      }
    });
  }

  openEditTaskDialog(task: Task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '400px',
      data: { ...task } // Create a copy of the task to avoid direct mutation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the task
        this.taskService.updateTask(result.taskId, result).subscribe(() => {
          //TODO: handle potential error
          this.loadTasks(); // Reload tasks after update
        });
      }
    });
  }
}