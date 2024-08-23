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

@Component({
  selector: 'app-create-task-dialog',
  template: `
    <h2 mat-dialog-title>Create New Task</h2>
    <mat-dialog-content>
      <mat-form-field>
        <input matInput placeholder="Title" [(ngModel)]="task.title">
      </mat-form-field>
      <mat-form-field>
        <textarea matInput placeholder="Description" [(ngModel)]="task.description"></textarea>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Due date</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="task.dueDate" [value]="task.dueDate">
        <mat-hint>MM/DD/YYYY</mat-hint>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSubmit()">Create</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field { width: 100%; margin-bottom: 15px; }
  `],
  imports: [
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

  constructor(public dialogRef: MatDialogRef<CreateTaskDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // FIXME: required title and dueDate non-empty
    // TODO: define the date format as a constant in a separate file
    this.task.dueDate = moment(this.task.dueDate).format(GlobalConstants.DATE_TIME_FORMAT);
    this.dialogRef.close(this.task);
  }
}