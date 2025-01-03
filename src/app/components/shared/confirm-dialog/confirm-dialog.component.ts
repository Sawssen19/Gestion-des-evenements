import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

export interface ConfirmDialogData {
  title: string;
  message: string;
  input?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      <div mat-dialog-content class="dialog-content">
        <p class="dialog-message">{{ data.message }}</p>
        <mat-form-field *ngIf="data.input" appearance="outline" class="full-width">
          <mat-label>Votre texte</mat-label>
          <textarea matInput [(ngModel)]="inputValue" cdkTextareaAutosize></textarea>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="dialog-actions">
        <button mat-button class="cancel-button" (click)="onNoClick()">
          Annuler
        </button>
        <button mat-raised-button color="warn" class="confirm-button" (click)="onYesClick()">
          Confirmer
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      min-width: 320px;
      max-width: 480px;
      border-radius: 8px;
      background-color: #ffffff;
    }

    .dialog-title {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 500;
      color: #333333;
    }

    .dialog-content {
      margin-bottom: 24px;
    }

    .dialog-message {
      margin: 0 0 16px 0;
      font-size: 16px;
      line-height: 1.5;
      color: #666666;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 0;
      margin: 0;
      border-top: 1px solid #eeeeee;
      padding-top: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      margin-bottom: 16px;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    .cancel-button {
      color: #666666;
    }

    .confirm-button {
      min-width: 100px;
    }

    ::ng-deep .mat-mdc-dialog-container {
      padding: 0 !important;
    }

    ::ng-deep .mat-mdc-dialog-surface {
      border-radius: 8px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule
  ]
})
export class ConfirmDialogComponent {
  inputValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(this.data.input ? this.inputValue : true);
  }
}
