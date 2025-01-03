import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Advertisement } from '../../../models/advertisement.model';

@Component({
  selector: 'app-advertisement-form-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data?.ad ? 'Modifier la publicité' : 'Nouvelle publicité' }}</h2>
      
      <form [formGroup]="adForm" class="ad-form">
        <div mat-dialog-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Titre</mat-label>
            <input matInput formControlName="title" required>
            <mat-error *ngIf="adForm.get('title')?.hasError('required')">
              Le titre est requis
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" required></textarea>
            <mat-error *ngIf="adForm.get('description')?.hasError('required')">
              La description est requise
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Type</mat-label>
              <mat-select formControlName="type" required>
                <mat-option value="banner">Bannière</mat-option>
                <mat-option value="video">Vidéo</mat-option>
                <mat-option value="sponsored">Sponsorisé</mat-option>
              </mat-select>
              <mat-error *ngIf="adForm.get('type')?.hasError('required')">
                Le type est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Position</mat-label>
              <mat-select formControlName="position" required>
                <mat-option value="header">En-tête</mat-option>
                <mat-option value="sidebar">Barre latérale</mat-option>
                <mat-option value="content">Dans le contenu</mat-option>
                <mat-option value="footer">Pied de page</mat-option>
              </mat-select>
              <mat-error *ngIf="adForm.get('position')?.hasError('required')">
                La position est requise
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date de début</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
              <mat-error *ngIf="adForm.get('startDate')?.hasError('required')">
                La date de début est requise
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date de fin</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endDate" required>
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
              <mat-error *ngIf="adForm.get('endDate')?.hasError('required')">
                La date de fin est requise
              </mat-error>
            </mat-form-field>
          </div>

          <div class="image-upload-section">
            <div class="current-image" *ngIf="adForm.get('imageUrl')?.value">
              <img [src]="adForm.get('imageUrl')?.value" alt="Image de la publicité">
            </div>
            
            <div class="upload-controls">
              <input
                type="file"
                #fileInput
                style="display: none"
                accept="image/*"
                (change)="onFileSelected($event)"
              >
              
              <button mat-stroked-button type="button" (click)="fileInput.click()">
                <mat-icon>add_photo_alternate</mat-icon>
                Ajouter une image
              </button>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL de l'image</mat-label>
                <input matInput formControlName="imageUrl">
                <button mat-icon-button matSuffix 
                  *ngIf="adForm.get('imageUrl')?.value" 
                  type="button"
                  (click)="clearImage()"
                >
                  <mat-icon>clear</mat-icon>
                </button>
                <mat-hint>Collez une URL d'image ou téléchargez-en une</mat-hint>
              </mat-form-field>
            </div>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>URL de destination</mat-label>
            <input matInput formControlName="linkUrl" required>
            <mat-error *ngIf="adForm.get('linkUrl')?.hasError('required')">
              L'URL de destination est requise
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Public cible (appuyez sur Entrée pour ajouter)</mat-label>
            <mat-chip-grid #chipGrid>
              <mat-chip-row
                *ngFor="let audience of targetAudience"
                [removable]="true"
                (removed)="removeAudience(audience)"
              >
                {{audience}}
                <button matChipRemove>
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip-row>
              <input
                [matChipInputFor]="chipGrid"
                [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                (matChipInputTokenEnd)="addAudience($event)"
                placeholder="Nouveau public..."
              />
            </mat-chip-grid>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="status" required>
              <mat-option value="active">Actif</mat-option>
              <mat-option value="paused">En pause</mat-option>
              <mat-option value="scheduled">Planifié</mat-option>
              <mat-option value="ended">Terminé</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">
            <mat-icon>close</mat-icon>
            Annuler
          </button>
          <button mat-raised-button color="primary" type="submit" 
            [disabled]="!adForm.valid"
            (click)="onSubmit()"
          >
            <mat-icon>check</mat-icon>
            {{ data?.ad ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
    }

    h2 {
      margin: 0;
      padding: 16px 24px;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }

    .ad-form {
      display: flex;
      flex-direction: column;
    }

    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px;
      max-height: 70vh;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .image-upload-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      border: 1px dashed #ccc;
      border-radius: 4px;
      background: #fafafa;
    }

    .current-image {
      width: 100%;
      max-height: 200px;
      overflow: hidden;
      border-radius: 4px;
    }

    .current-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .upload-controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 0;
    }

    button mat-icon {
      margin-right: 8px;
    }

    mat-dialog-actions button {
      margin-left: 8px;
    }
  `]
})
export class AdvertisementFormDialogComponent {
  adForm: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  targetAudience: string[] = [];
  ad?: Advertisement;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdvertisementFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ad?: Advertisement }
  ) {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [''],
      linkUrl: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), Validators.required],
      location: [''],
      type: ['banner', Validators.required],
      position: ['sidebar', Validators.required],
      status: ['active', Validators.required]
    });

    if (data?.ad) {
      this.ad = data.ad;
      this.adForm.patchValue({
        title: data.ad.title,
        description: data.ad.description,
        imageUrl: data.ad.imageUrl,
        linkUrl: data.ad.linkUrl,
        startDate: data.ad.startDate,
        endDate: data.ad.endDate,
        location: data.ad.location,
        type: data.ad.type,
        position: data.ad.position,
        status: data.ad.status
      });
      this.targetAudience = [...(data.ad.targetAudience || [])];
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.adForm.patchValue({
          imageUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.adForm.patchValue({
      imageUrl: ''
    });
  }

  addAudience(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.targetAudience.push(value);
    }
    event.chipInput!.clear();
  }

  removeAudience(audience: string) {
    const index = this.targetAudience.indexOf(audience);
    if (index >= 0) {
      this.targetAudience.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.adForm.valid) {
      const formValue = this.adForm.value;
      const adData = {
        ...formValue,
        targetAudience: this.targetAudience,
        id: this.ad?.id
      };
      this.dialogRef.close(adData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
