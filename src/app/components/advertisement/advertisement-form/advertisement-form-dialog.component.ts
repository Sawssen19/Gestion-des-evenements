import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { Advertisement } from '../../../models/advertisement.model';

@Component({
  selector: 'app-advertisement-form-dialog',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditing ? 'Modifier' : 'Créer' }} une annonce</h2>
    <mat-dialog-content>
      <form [formGroup]="adForm" class="ad-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" placeholder="Titre de l'annonce">
          <mat-error *ngIf="adForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" 
                    placeholder="Description de l'annonce"></textarea>
          <mat-error *ngIf="adForm.get('description')?.hasError('required')">
            La description est requise
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>URL de l'image</mat-label>
            <input matInput formControlName="imageUrl" placeholder="URL de l'image">
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>URL de destination</mat-label>
            <input matInput formControlName="linkUrl" placeholder="URL de destination">
            <mat-error *ngIf="adForm.get('linkUrl')?.hasError('required')">
              L'URL de destination est requise
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Date de début</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Date de fin</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate">
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Localisation</mat-label>
            <input matInput formControlName="location" placeholder="Localisation">
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="banner">Bannière</mat-option>
              <mat-option value="video">Vidéo</mat-option>
              <mat-option value="sponsored">Sponsorisé</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Public cible</mat-label>
          <mat-chip-grid #chipGrid aria-label="Sélection du public cible">
            <mat-chip-row *ngFor="let audience of targetAudience"
                       [removable]="true"
                       (removed)="removeAudience(audience)"
                       [editable]="true"
                       (edited)="editAudience(audience, $event)">
              {{audience}}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip-row>
            <input placeholder="Nouveau public..."
                   [matChipInputFor]="chipGrid"
                   [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                   (matChipInputTokenEnd)="addAudience($event)">
          </mat-chip-grid>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Position</mat-label>
            <mat-select formControlName="position">
              <mat-option value="header">En-tête</mat-option>
              <mat-option value="sidebar">Barre latérale</mat-option>
              <mat-option value="footer">Pied de page</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="status">
              <mat-option value="active">Actif</mat-option>
              <mat-option value="inactive">Inactif</mat-option>
              <mat-option value="pending">En attente</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="adForm.invalid"
              (click)="onSubmit()">
        {{ isEditing ? 'Modifier' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .ad-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: 48%;
    }

    .form-row {
      display: flex;
      gap: 4%;
      width: 100%;
    }

    mat-chip-grid {
      width: 100%;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 16px;
      }

      .half-width {
        width: 100%;
      }
    }
  `]
})
export class AdvertisementFormDialogComponent {
  adForm: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  targetAudience: string[] = [];
  isEditing: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdvertisementFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { advertisement?: Advertisement }
  ) {
    this.isEditing = data?.advertisement !== undefined;
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [''],
      linkUrl: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: [''],
      type: ['banner', Validators.required],
      position: ['header', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data?.advertisement) {
      this.adForm.patchValue({
        title: this.data.advertisement.title,
        description: this.data.advertisement.description,
        imageUrl: this.data.advertisement.imageUrl,
        linkUrl: this.data.advertisement.linkUrl,
        startDate: this.data.advertisement.startDate,
        endDate: this.data.advertisement.endDate,
        location: this.data.advertisement.location,
        type: this.data.advertisement.type,
        position: this.data.advertisement.position,
        status: this.data.advertisement.status
      });

      if (this.data.advertisement.targetAudience) {
        this.targetAudience = [...this.data.advertisement.targetAudience];
      }
    }
  }

  addAudience(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.targetAudience.push(value);
    }
    event.chipInput!.clear();
  }

  removeAudience(audience: string): void {
    const index = this.targetAudience.indexOf(audience);
    if (index >= 0) {
      this.targetAudience.splice(index, 1);
    }
  }

  editAudience(audience: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    const index = this.targetAudience.indexOf(audience);

    if (!value) {
      this.removeAudience(audience);
      return;
    }

    if (index >= 0) {
      this.targetAudience[index] = value;
    }
  }

  onSubmit(): void {
    if (this.adForm.valid) {
      const formValue = this.adForm.value;
      const ad: Partial<Advertisement> = {
        ...formValue,
        targetAudience: this.targetAudience,
        placement: {
          position: formValue.position,
          pages: ['home']
        }
      };
      delete ad.position;
      this.dialogRef.close(ad);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
