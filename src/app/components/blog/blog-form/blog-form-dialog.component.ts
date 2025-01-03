import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Blog } from '../../../models/blog.model';

@Component({
  selector: 'app-blog-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ data ? 'Modifier l\'article' : 'Nouvel article' }}</h2>
      
      <mat-dialog-content>
        <form [formGroup]="blogForm" class="blog-form">
          <mat-form-field appearance="outline">
            <mat-label>Titre</mat-label>
            <input matInput formControlName="title" placeholder="Entrez le titre">
            <mat-error *ngIf="blogForm.get('title')?.hasError('required')">
              Le titre est requis
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contenu</mat-label>
            <textarea matInput
                      formControlName="content"
                      placeholder="Écrivez votre article..."
                      rows="10"
                      #contentInput></textarea>
            <mat-error *ngIf="blogForm.get('content')?.hasError('required')">
              Le contenu est requis
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>URL de l'image</mat-label>
            <input matInput formControlName="imageUrl" placeholder="https://...">
            <mat-icon matSuffix>image</mat-icon>
          </mat-form-field>

          <div *ngIf="blogForm.get('imageUrl')?.value" class="image-preview">
            <img [src]="blogForm.get('imageUrl')?.value"
                 alt="Aperçu de l'image"
                 (error)="handleImageError($event)">
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Tags</mat-label>
            <mat-chip-grid #chipGrid>
              <mat-chip-row *ngFor="let tag of tags"
                         [removable]="true"
                         (removed)="removeTag(tag)">
                {{tag}}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip-row>
              <input placeholder="Nouveau tag..."
                     [matChipInputFor]="chipGrid"
                     [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                     (matChipInputTokenEnd)="addTag($event)">
            </mat-chip-grid>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close()">Annuler</button>
        <button mat-raised-button
                color="primary"
                [disabled]="!blogForm.valid"
                (click)="save()">
          {{ data ? 'Mettre à jour' : 'Créer' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      max-width: 800px;
    }

    .dialog-title {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    .blog-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 20px;
    }

    mat-form-field {
      width: 100%;
    }

    .image-preview {
      width: 100%;
      max-height: 300px;
      overflow: hidden;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    mat-dialog-actions {
      margin-top: 20px;
      padding: 20px 0 0;
      border-top: 1px solid #eee;
    }

    textarea {
      min-height: 150px;
      resize: vertical;
    }

    mat-chip-grid {
      width: 100%;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      margin-top: 0.5em !important;
    }

    ::ng-deep .mat-mdc-dialog-content {
      max-height: 80vh;
    }
  `]
})
export class BlogFormDialogComponent {
  @ViewChild('contentInput') contentInput!: ElementRef;
  
  blogForm: FormGroup;
  tags: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BlogFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Blog | null
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: [''],
      author: ['Anonymous']
    });

    if (data) {
      this.blogForm.patchValue({
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        author: data.author
      });
      this.tags = [...(data.tags || [])];
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/default-blog.jpg';
  }

  save(): void {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;
      const blog: Partial<Blog> = {
        ...(this.data || {}),  // Préserver les données existantes
        ...formValue,         // Mettre à jour avec les nouvelles valeurs
        tags: this.tags,
        updatedAt: new Date().toISOString()
      };
      this.dialogRef.close(blog);
    }
  }
}
