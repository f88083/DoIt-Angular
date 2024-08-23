import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from './models/task.model';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import moment from 'moment';
import { GlobalConstants } from './shared/global-constants';

@Component({
  selector: 'app-edit-task-dialog',
  template: `
    <h2 mat-dialog-title>Edit Task</h2>
    <mat-dialog-content>
      <mat-form-field>
        <input matInput placeholder="Title" [(ngModel)]="task.title">
      </mat-form-field>
      <mat-form-field>
        <textarea matInput placeholder="Description" [(ngModel)]="task.description"></textarea>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Due date</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="task.dueDate">
        <mat-hint>MM/DD/YYYY</mat-hint>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field { width: 100%; margin-bottom: 15px; }
  `],
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
})
export class EditTaskDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // FIXME: timezone isn't correctly set, maybe it's backend problem
    this.task.dueDate = moment(this.task.dueDate).format(GlobalConstants.DATE_TIME_FORMAT);
    this.dialogRef.close(this.task);
  }
}