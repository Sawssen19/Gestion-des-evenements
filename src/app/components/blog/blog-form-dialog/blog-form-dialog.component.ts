import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Blog } from '../../../models/blog.model';

interface DialogData {
  title: string;
  blog?: Blog;
}

@Component({
  selector: 'app-blog-form-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <div mat-dialog-content>
      <form [formGroup]="blogForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" required>
          <mat-error *ngIf="blogForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contenu</mat-label>
          <textarea matInput formControlName="content" rows="6" required></textarea>
          <mat-error *ngIf="blogForm.get('content')?.hasError('required')">
            Le contenu est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status">
            <mat-option value="draft">Brouillon</mat-option>
            <mat-option value="published">Publié</mat-option>
            <mat-option value="archived">Archivé</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>URL de l'image</mat-label>
          <input matInput formControlName="imageUrl" placeholder="https://...">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tags (séparés par des virgules)</mat-label>
          <input matInput formControlName="tags" placeholder="actualités, technologie">
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!blogForm.valid">
        {{ data.blog ? 'Modifier' : 'Créer' }}
      </button>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-form-field {
      margin-bottom: 16px;
    }

    [mat-dialog-content] {
      min-width: 320px;
      max-height: 80vh;
      padding-top: 16px;
    }

    [mat-dialog-actions] {
      padding: 16px 0;
      margin: 0;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class BlogFormDialogComponent {
  blogForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BlogFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      status: ['published'],
      imageUrl: [''],
      tags: ['']
    });

    if (data.blog) {
      this.blogForm.patchValue({
        title: data.blog.title,
        content: data.blog.content,
        status: data.blog.status,
        imageUrl: data.blog.imageUrl,
        tags: data.blog.tags?.join(', ') || ''
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;
      const tags = formValue.tags
        ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : [];

      const blogData = {
        ...formValue,
        tags,
        author: 'John Doe' // À remplacer par l'utilisateur connecté
      };

      this.dialogRef.close(blogData);
    }
  }
}
