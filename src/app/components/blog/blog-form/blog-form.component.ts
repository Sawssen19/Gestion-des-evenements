import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Blog } from '../../../models/blog.model';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-blog-form',
  template: `
    <form [formGroup]="blogForm" (ngSubmit)="submit()" class="blog-form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Titre</mat-label>
        <input matInput formControlName="title" placeholder="Entrez le titre">
        <mat-error *ngIf="blogForm.get('title')?.hasError('required')">
          Le titre est requis
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Contenu</mat-label>
        <textarea matInput formControlName="content" rows="10" 
                  placeholder="Écrivez votre article ici"></textarea>
        <mat-error *ngIf="blogForm.get('content')?.hasError('required')">
          Le contenu est requis
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Tags</mat-label>
        <mat-chip-grid #chipGrid aria-label="Tag selection">
          <mat-chip-row *ngFor="let tag of tags"
                       [removable]="true"
                       (removed)="removeTag(tag)"
                       [editable]="true"
                       (edited)="editTag(tag, $event)">
            {{tag}}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip-row>
          <input placeholder="Nouveau tag..."
                 [matChipInputFor]="chipGrid"
                 [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                 (matChipInputTokenEnd)="addTag($event)">
        </mat-chip-grid>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>URL de l'image</mat-label>
        <input matInput formControlName="imageUrl" placeholder="URL de l'image (optionnel)">
      </mat-form-field>

      <div class="form-actions">
        <button mat-button type="button" (click)="onCancel.emit()">
          Annuler
        </button>
        <button mat-raised-button color="primary" type="submit" 
                [disabled]="blogForm.invalid">
          {{ blog ? 'Modifier' : 'Créer' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .blog-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }

    textarea {
      min-height: 100px;
    }
  `]
})
export class BlogFormComponent implements OnInit {
  @Input() blog?: Blog;
  @Output() onSubmit = new EventEmitter<Partial<Blog>>();
  @Output() onCancel = new EventEmitter<void>();

  blogForm: FormGroup;
  tags: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit() {
    if (this.blog) {
      this.blogForm.patchValue({
        title: this.blog.title,
        content: this.blog.content,
        imageUrl: this.blog.imageUrl
      });
      this.tags = [...this.blog.tags];
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
      event.chipInput!.clear();
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  editTag(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removeTag(tag);
      return;
    }
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index] = value;
    }
  }

  submit() {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;
      const blog: Partial<Blog> = {
        ...formValue,
        tags: this.tags,
        author: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        isLiked: false
      };
      this.onSubmit.emit(blog);
    }
  }
}
