import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';
import { Task, TaskCreateRequest, taskStatus } from './models/task.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from './task-create.component';
import { EditTaskDialogComponent } from './task-edit.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="todo-container">
      <div class="header">
        <h1>Do It!</h1>
        <div>
          <button class="create-button" (click)="openCreateTaskDialog()">+ New Task</button>
          <button mat-button (click)="logout()">Logout</button>
        </div>
      </div>
      <ul class="task-list">
        <li *ngFor="let task of activeTasks" class="task-item">
          <div class="task-header">
            <div class="task-title">
              <mat-checkbox
                     [checked]="task.status === taskStatus.completed" 
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
            <div>
              <button class="task-delete-btn" mat-icon-button (click)="deleteTask(task)">
                <mat-icon>delete</mat-icon>
              </button>
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
          </div>
          <p *ngIf="task.showDescription" class="task-description">{{ task.description }}</p>
        </li>
      </ul>
      <mat-expansion-panel *ngIf="completedTasks.length > 0">
        <mat-expansion-panel-header>
          <mat-panel-title>Completed Tasks</mat-panel-title>
        </mat-expansion-panel-header>
        <ul class="task-list">
          <li *ngFor="let task of completedTasks" class="task-item completed">
            <!-- Similar content as active tasks, but without checkbox -->
            <div class="task-header">
              <div class="task-title">
                <mat-checkbox
                      [checked]="task.status === taskStatus.completed" 
                      (change)="completeTask(task)"
                      (click)="$event.stopPropagation()"
                      class="task-checkbox"
                      color="primary">
                </mat-checkbox>
                <div class="task-info">
                  <span class="status">{{ task.title }}</span>
                  <span class="due-date">{{ task.dueDate | date }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </mat-expansion-panel>
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
    MatIconModule,
    MatExpansionModule
  ]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  activeTasks: Task[] = [];
  completedTasks: Task[] = [];
  taskStatus = taskStatus;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) { }

  // Load tasks when the component is initialized
  ngOnInit() {
    this.loadTasks();
    // setInterval(() => this.deleteCompletedTasks(), 5000); // Check every 5 seconds
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.separateTasks();
        console.log('Tasks loaded and sorted:', this.tasks);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  separateTasks() { // TODO: Could be more efficient, unecessary to filter again
    this.activeTasks = this.tasks.filter(task => task.status === taskStatus.pending);
    this.completedTasks = this.tasks.filter(task => task.status === taskStatus.completed);
    this.sortByDate(this.activeTasks);
    this.sortByUpdateTime(this.completedTasks);
  }

  sortByDate(tasks: Task[]) {
    tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  sortByUpdateTime(tasks: Task[]) {
    tasks.sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime());
  }


  // Mark task as completed or not completed
  completeTask(task: Task) {
    // Change the status of the task
    task.status = task.status === taskStatus.pending ? taskStatus.completed : taskStatus.pending;
    this.taskService.updateTask(task.taskId, task).subscribe({
      next: (updatedTask) => {
        console.log('Task updated:', updatedTask);
        // Update the task in the local array
        const index = this.tasks.findIndex(t => t.taskId === updatedTask.taskId);
        // If the task is found, update it
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.separateTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        // Revert the change if the update fails
        task.status = task.status === taskStatus.pending ? taskStatus.completed : taskStatus.pending;
      }
    });
  }

  // Actually delete completed tasks
  deleteCompletedTasks() {
    const completedTasks = this.tasks.filter(task => task.status === taskStatus.completed);
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

        this.taskService.createTask(newTask).subscribe({
          next: () => {
            console.log(`Task has been created successfully`);
            this.loadTasks();
          },
          error: (error) => {
            console.error(`Failed to create the new task...`, error);
          }
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
        this.taskService.updateTask(result.taskId, result).subscribe({
          next: () => {
            console.log(`Task has been edited successfully`);
            this.loadTasks(); // Reload tasks after edited
          },
          error: (error) => {
            console.error(`Failed to update the task with taskId: ${result.taskId}...`, error);
          }
        });
      }
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.taskId).subscribe({
      next: () => {
        console.log(`Task: "${task.title}" deleted successfully`);
        this.tasks = this.tasks.filter(t => t.taskId !== task.taskId);
        this.separateTasks();
      },
      error: (error) => {
        console.error(`Error deleting task ${task.taskId}:`, error);
      }
    });
  }

  // TODO: Should logged out (remove the token from the localstorage) automatically if the token has expired
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}