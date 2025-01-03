import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Advertisement } from '../../../models/advertisement.model';

// Format de date personnalisé
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    MatIconModule,
    MatStepperModule,
    MatRadioModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  template: `
    <div class="dialog-container">
      <mat-stepper linear #stepper>
        <!-- Étape 1: Informations de base -->
        <mat-step [stepControl]="basicInfoForm">
          <ng-template matStepLabel>Informations de base</ng-template>
          <form [formGroup]="basicInfoForm" class="form-step">
            <h3>Informations générales</h3>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Titre</mat-label>
              <input matInput formControlName="title" placeholder="Titre de la publicité">
              <mat-error *ngIf="basicInfoForm.get('title')?.hasError('required')">
                Le titre est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4" 
                      placeholder="Description détaillée de la publicité"></textarea>
              <mat-error *ngIf="basicInfoForm.get('description')?.hasError('required')">
                La description est requise
              </mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Type de publicité</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="banner">
                    <mat-icon>view_carousel</mat-icon>
                    <span>Bannière</span>
                  </mat-option>
                  <mat-option value="video">
                    <mat-icon>play_circle</mat-icon>
                    <span>Vidéo</span>
                  </mat-option>
                  <mat-option value="sponsored">
                    <mat-icon>star</mat-icon>
                    <span>Sponsorisé</span>
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="basicInfoForm.get('type')?.hasError('required')">
                  Le type est requis
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Position</mat-label>
                <mat-select formControlName="position">
                  <mat-option value="header">En-tête</mat-option>
                  <mat-option value="sidebar">Barre latérale</mat-option>
                  <mat-option value="content">Dans le contenu</mat-option>
                  <mat-option value="footer">Pied de page</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button matStepperNext color="primary">Suivant</button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 2: Médias et liens -->
        <mat-step [stepControl]="mediaForm">
          <ng-template matStepLabel>Médias et liens</ng-template>
          <form [formGroup]="mediaForm" class="form-step">
            <h3>Médias et liens</h3>

            <div class="image-preview" *ngIf="mediaForm.get('imageUrl')?.value">
              <img [src]="mediaForm.get('imageUrl')?.value" alt="Aperçu">
            </div>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>URL de l'image</mat-label>
              <input matInput formControlName="imageUrl" placeholder="URL de l'image">
              <mat-icon matSuffix>image</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>URL de destination</mat-label>
              <input matInput formControlName="linkUrl" placeholder="URL de destination">
              <mat-icon matSuffix>link</mat-icon>
              <mat-error *ngIf="mediaForm.get('linkUrl')?.hasError('required')">
                L'URL de destination est requise
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button matStepperPrevious>Retour</button>
              <button mat-button matStepperNext color="primary">Suivant</button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 3: Planification -->
        <mat-step [stepControl]="schedulingForm">
          <ng-template matStepLabel>Planification</ng-template>
          <form [formGroup]="schedulingForm" class="form-step">
            <h3>Planification</h3>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Date de début</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate" [min]="minDate">
                <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
                <mat-error *ngIf="schedulingForm.get('startDate')?.hasError('required')">
                  La date de début est requise
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Date de fin</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate" [min]="schedulingForm.get('startDate')?.value">
                <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
                <mat-error *ngIf="schedulingForm.get('endDate')?.hasError('required')">
                  La date de fin est requise
                </mat-error>
                <mat-error *ngIf="schedulingForm.hasError('dateRange')">
                  La date de fin doit être postérieure à la date de début
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Localisation</mat-label>
              <input matInput formControlName="location" placeholder="Localisation">
              <mat-icon matSuffix>location_on</mat-icon>
            </mat-form-field>

            <div class="audience-section">
              <h4>Public cible</h4>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Ajouter un public cible</mat-label>
                <mat-chip-grid #chipGrid>
                  <mat-chip-row *ngFor="let audience of targetAudience"
                              (removed)="removeAudience(audience)">
                    {{audience}}
                    <button matChipRemove>
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                </mat-chip-grid>
                <input placeholder="Nouveau public..."
                      [matChipInputFor]="chipGrid"
                      [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                      (matChipInputTokenEnd)="addAudience($event)">
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button matStepperPrevious>Retour</button>
              <button mat-button matStepperNext color="primary">Suivant</button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 4: Confirmation -->
        <mat-step>
          <ng-template matStepLabel>Confirmation</ng-template>
          <div class="confirmation-step">
            <h3>Résumé de la publicité</h3>
            
            <div class="summary-card">
              <div class="summary-section">
                <h4>Informations de base</h4>
                <p><strong>Titre:</strong> {{ basicInfoForm.get('title')?.value }}</p>
                <p><strong>Type:</strong> {{ getTypeLabel(basicInfoForm.get('type')?.value) }}</p>
                <p><strong>Position:</strong> {{ getPositionLabel(basicInfoForm.get('position')?.value) }}</p>
              </div>

              <div class="summary-section">
                <h4>Planification</h4>
                <p><strong>Début:</strong> {{ formatDate(schedulingForm.get('startDate')?.value) }}</p>
                <p><strong>Fin:</strong> {{ formatDate(schedulingForm.get('endDate')?.value) }}</p>
                <p><strong>Localisation:</strong> {{ schedulingForm.get('location')?.value || 'Non spécifié' }}</p>
              </div>

              <div class="summary-section">
                <h4>Public cible</h4>
                <div class="audience-chips">
                  <mat-chip-row *ngFor="let audience of targetAudience">
                    {{audience}}
                  </mat-chip-row>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button matStepperPrevious>Retour</button>
              <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="!isValid()">
                {{ isEditing ? 'Mettre à jour' : 'Créer' }}
              </button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-step {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px 0;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: 48%;
    }

    .form-row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }

    .image-preview {
      width: 100%;
      max-height: 200px;
      overflow: hidden;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .audience-section {
      margin-top: 16px;
    }

    h3 {
      margin: 0 0 16px 0;
      color: rgba(0, 0, 0, 0.87);
    }

    h4 {
      margin: 0 0 8px 0;
      color: rgba(0, 0, 0, 0.87);
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    ::ng-deep .mat-step-header {
      padding: 16px !important;
    }

    ::ng-deep .mat-step-label {
      font-size: 16px !important;
    }

    ::ng-deep .mat-datepicker-toggle {
      color: rgba(0, 0, 0, 0.54);
    }

    ::ng-deep .mat-datepicker-content {
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AdvertisementFormDialogComponent implements OnInit {
  basicInfoForm: FormGroup;
  mediaForm: FormGroup;
  schedulingForm: FormGroup;
  isEditing = false;
  targetAudience: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  advertisement?: Advertisement;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdvertisementFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { advertisement?: Advertisement }
  ) {
    this.isEditing = !!data?.advertisement;
    this.advertisement = data?.advertisement;

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    this.basicInfoForm = this.fb.group({
      title: [data?.advertisement?.title || '', Validators.required],
      description: [data?.advertisement?.description || '', Validators.required],
      type: [data?.advertisement?.type || 'banner', Validators.required],
      position: [data?.advertisement?.position || 'header', Validators.required]
    });

    this.mediaForm = this.fb.group({
      imageUrl: [data?.advertisement?.imageUrl || ''],
      linkUrl: [data?.advertisement?.linkUrl || '', Validators.required]
    });

    this.schedulingForm = this.fb.group({
      startDate: [data?.advertisement?.startDate || today, Validators.required],
      endDate: [data?.advertisement?.endDate || thirtyDaysFromNow, Validators.required]
    }, { validators: this.dateRangeValidator });

    if (data?.advertisement?.targetAudience) {
      this.targetAudience = [...data.advertisement.targetAudience];
    }
  }

  dateRangeValidator(group: FormGroup): {[key: string]: any} | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    
    if (start && end) {
      const isRangeValid = (end.getTime() - start.getTime() >= 0);
      return isRangeValid ? null : { dateRange: true };
    }
    return null;
  }

  ngOnInit(): void {
    // Écouter les changements de date de début pour mettre à jour la date de fin minimale
    this.schedulingForm.get('startDate')?.valueChanges.subscribe(startDate => {
      const endDateControl = this.schedulingForm.get('endDate');
      if (startDate && endDateControl?.value && endDateControl.value < startDate) {
        endDateControl.setValue(startDate);
      }
    });
  }

  addAudience(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.targetAudience.push(value);
      event.chipInput!.clear();
    }
  }

  removeAudience(audience: string): void {
    const index = this.targetAudience.indexOf(audience);
    if (index >= 0) {
      this.targetAudience.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.basicInfoForm.valid && this.mediaForm.valid && this.schedulingForm.valid) {
      const formData = {
        ...this.basicInfoForm.value,
        ...this.mediaForm.value,
        ...this.schedulingForm.value,
        targetAudience: this.targetAudience,
        status: 'active'
      };

      if (this.isEditing && this.advertisement?.id) {
        formData.id = this.advertisement.id;
      }

      this.dialogRef.close(formData);
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'banner': return 'view_carousel';
      case 'video': return 'play_circle';
      case 'sponsored': return 'star';
      default: return 'ads_click';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'banner': return 'Bannière';
      case 'video': return 'Vidéo';
      case 'sponsored': return 'Sponsorisé';
      default: return type;
    }
  }

  getPositionLabel(position: string): string {
    switch (position) {
      case 'header': return 'En-tête';
      case 'sidebar': return 'Barre latérale';
      case 'content': return 'Dans le contenu';
      case 'footer': return 'Pied de page';
      default: return position;
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return 'Non spécifié';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  isValid(): boolean {
    return this.basicInfoForm.valid && 
           this.mediaForm.valid && 
           this.schedulingForm.valid;
  }
}
