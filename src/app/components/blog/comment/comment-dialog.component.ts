import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  template: `
    <div class="comment-dialog">
      <h2 mat-dialog-title>Modifier le commentaire</h2>
      <div mat-dialog-content>
        <form [formGroup]="commentForm" class="comment-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Commentaire</mat-label>
            <textarea matInput formControlName="content" rows="4" required></textarea>
            <mat-error *ngIf="commentForm.get('content')?.hasError('required')">
              Le commentaire est requis
            </mat-error>
          </mat-form-field>
        </form>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Annuler
        </button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!commentForm.valid">
          <mat-icon>check</mat-icon>
          Modifier
        </button>
      </div>
    </div>
  `,
  styles: [`
    .comment-dialog {
      padding: 1rem;
    }

    .comment-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
      min-width: 300px;
    }

    .full-width {
      width: 100%;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    button {
      margin-left: 8px;
    }

    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class CommentDialogComponent {
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { content: string }
  ) {
    this.commentForm = this.fb.group({
      content: [data.content, Validators.required]
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      this.dialogRef.close(this.commentForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
