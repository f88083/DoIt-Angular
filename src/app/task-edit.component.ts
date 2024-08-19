import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from './models/task.model';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

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
        <input matInput [matDatepicker]="picker" placeholder="Due Date" [(ngModel)]="task.dueDate">
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
    this.dialogRef.close(this.task);
  }
}