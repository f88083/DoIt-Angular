import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { TaskCreateRequest } from './models/task.model';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { GlobalConstants } from './shared/global-constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-task-dialog',
  template: `
    <h2 mat-dialog-title>Create New Task</h2>
    <mat-dialog-content>
      <mat-form-field>
          <input matInput placeholder="Title" [(ngModel)]="task.title" required>
          <mat-error *ngIf="!task.title">Title is required</mat-error>
      </mat-form-field>
      <mat-form-field>
          <textarea matInput placeholder="Description" [(ngModel)]="task.description"></textarea>
      </mat-form-field>
      <mat-form-field>
          <mat-label>Due date</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="task.dueDate" [value]="task.dueDate" required>
          <mat-hint>MM/DD/YYYY</mat-hint>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="!task.dueDate">Due date is required</mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSubmit()" [disabled]="!task.title || !task.dueDate">Create</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field { width: 100%; margin-bottom: 15px; }
  `],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
  ],
  standalone: true,
})
export class CreateTaskDialogComponent {
  task: TaskCreateRequest = {
    title: '',
    description: '',
    status: 0,
    dueDate: moment().format(GlobalConstants.DATE_TIME_FORMAT),
  };

  constructor(public dialogRef: MatDialogRef<CreateTaskDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.task.dueDate = moment(this.task.dueDate).format(GlobalConstants.DATE_TIME_FORMAT);
    this.dialogRef.close(this.task);
  }
}