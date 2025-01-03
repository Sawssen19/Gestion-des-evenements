import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdvertisementService } from '../../../services/advertisement.service';
import { Advertisement, AdvertisementStatus, CreateAdvertisementDTO } from '../../../models/advertisement.model';
import { AdvertisementFormDialogComponent } from '../advertisement-form/advertisement-form-dialog.component';

@Component({
  selector: 'app-ad-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container-fluid p-4">
      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title>Advertisement Management</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Statistics Cards -->
          <mat-grid-list cols="3" rowHeight="100px" class="mb-4">
            <mat-grid-tile>
              <mat-card class="stats-card bg-primary text-white w-100 h-100">
                <mat-card-content>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 class="mb-0">Total Ads</h3>
                      <p class="display-6 mb-0">{{ totalAds }}</p>
                    </div>
                    <mat-icon class="stats-icon">assessment</mat-icon>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>
            
            <mat-grid-tile>
              <mat-card class="stats-card bg-success text-white w-100 h-100">
                <mat-card-content>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 class="mb-0">Active Ads</h3>
                      <p class="display-6 mb-0">{{ activeAds }}</p>
                    </div>
                    <mat-icon class="stats-icon">trending_up</mat-icon>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>
            
            <mat-grid-tile>
              <mat-card class="stats-card bg-warning text-white w-100 h-100">
                <mat-card-content>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 class="mb-0">Scheduled Ads</h3>
                      <p class="display-6 mb-0">{{ scheduledAds }}</p>
                    </div>
                    <mat-icon class="stats-icon">schedule</mat-icon>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>
          </mat-grid-list>

          <!-- Ad Creation Form -->
          <mat-card class="mb-4">
            <mat-card-header>
              <mat-card-title>Create New Advertisement</mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <form [formGroup]="adForm" (ngSubmit)="onSubmit()" class="row g-3">
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Title</mat-label>
                    <input matInput formControlName="title" placeholder="Enter title">
                  </mat-form-field>
                </div>
                
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Type</mat-label>
                    <mat-select formControlName="type">
                      <mat-option value="banner">Banner</mat-option>
                      <mat-option value="video">Video</mat-option>
                      <mat-option value="sponsored">Sponsored</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                
                <div class="col-12">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description" rows="3"></textarea>
                  </mat-form-field>
                </div>
                
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Start Date</mat-label>
                    <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                    <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                    <mat-datepicker #startPicker></mat-datepicker>
                  </mat-form-field>
                </div>
                
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>End Date</mat-label>
                    <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                    <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                    <mat-datepicker #endPicker></mat-datepicker>
                  </mat-form-field>
                </div>
                
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Image URL</mat-label>
                    <input matInput formControlName="imageUrl" placeholder="Enter image URL">
                    <mat-icon matSuffix>image</mat-icon>
                  </mat-form-field>
                </div>
                
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Link URL</mat-label>
                    <input matInput formControlName="linkUrl" placeholder="Enter link URL">
                    <mat-icon matSuffix>link</mat-icon>
                  </mat-form-field>
                </div>
                
                <div class="col-12">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Position</mat-label>
                    <mat-select formControlName="position">
                      <mat-option value="header">Header</mat-option>
                      <mat-option value="sidebar">Sidebar</mat-option>
                      <mat-option value="content">Content</mat-option>
                      <mat-option value="footer">Footer</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                
                <div class="col-12">
                  <button mat-raised-button color="primary" type="submit" [disabled]="!adForm.valid">
                    <mat-icon>add</mat-icon>
                    Create Advertisement
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>

          <!-- Advertisements List -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Active Advertisements</mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <div class="table-responsive">
                <table mat-table [dataSource]="advertisements" class="w-100">
                  <!-- Image & Title Column -->
                  <ng-container matColumnDef="image">
                    <th mat-header-cell *matHeaderCellDef>Image</th>
                    <td mat-cell *matCellDef="let ad">
                      <div class="ad-image-container me-3">
                        <img [src]="ad.imageUrl || defaultImageUrl" 
                             [alt]="ad.title"
                             class="ad-image"
                             (error)="handleImageError($event)">
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="title">
                    <th mat-header-cell *matHeaderCellDef>Title</th>
                    <td mat-cell *matCellDef="let ad">{{ ad.title }}</td>
                  </ng-container>

                  <!-- Type Column -->
                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef>Type</th>
                    <td mat-cell *matCellDef="let ad">{{ ad.type | titlecase }}</td>
                  </ng-container>

                  <!-- Status Column -->
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let ad">
                      <span [class]="getStatusClass(ad.status)">{{ ad.status | titlecase }}</span>
                    </td>
                  </ng-container>

                  <!-- Dates Column -->
                  <ng-container matColumnDef="dates">
                    <th mat-header-cell *matHeaderCellDef>Dates</th>
                    <td mat-cell *matCellDef="let ad">
                      {{ ad.startDate | date:'shortDate' }} - {{ ad.endDate | date:'shortDate' }}
                    </td>
                  </ng-container>

                  <!-- Statistics Columns -->
                  <ng-container matColumnDef="statistics">
                    <th mat-header-cell *matHeaderCellDef>Statistics</th>
                    <td mat-cell *matCellDef="let ad">
                      Views: {{ ad.statistics.views | number }}<br>
                      Clicks: {{ ad.statistics.clicks | number }}<br>
                      CTR: {{ formatCTR(ad.statistics.clickThroughRate) }}%
                    </td>
                  </ng-container>

                  <!-- Actions Column -->
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let ad">
                      <button mat-icon-button color="primary" (click)="editAd(ad)" matTooltip="Edit">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="accent" (click)="toggleStatus(ad)" 
                              [matTooltip]="ad.status === 'active' ? 'Pause' : 'Activate'">
                        <mat-icon>{{ getToggleButtonIcon(ad.status) }}</mat-icon>
                      </button>
                      <button mat-icon-button color="primary" (click)="duplicateAd(ad)" matTooltip="Duplicate">
                        <mat-icon>content_copy</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteAd(ad.id)" matTooltip="Delete">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .stats-card {
      margin: 8px;
      padding: 16px;
    }

    .stats-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .ad-image-container {
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      flex-shrink: 0;
    }

    .ad-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .ad-details {
      flex: 1;
    }

    .ad-title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .ad-description {
      color: rgba(0, 0, 0, 0.6);
    }

    mat-form-field {
      margin-bottom: 1rem;
    }

    .mat-mdc-table {
      width: 100%;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }

    .mat-mdc-header-cell {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }

    .mat-mdc-cell {
      color: rgba(0, 0, 0, 0.87);
    }

    .badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .bg-success {
      background-color: #4caf50 !important;
    }

    .bg-warning {
      background-color: #ff9800 !important;
    }

    .bg-secondary {
      background-color: #9e9e9e !important;
    }
  `]
})
export class AdManagementComponent implements OnInit, OnDestroy {
  adForm: FormGroup;
  advertisements: Advertisement[] = [];
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  displayedColumns: string[] = ['image', 'title', 'type', 'status', 'dates', 'statistics', 'actions'];
  defaultImageUrl = 'https://via.placeholder.com/60x60';

  constructor(
    private fb: FormBuilder,
    private adService: AdvertisementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['banner', Validators.required],
      imageUrl: ['', Validators.required],
      linkUrl: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      position: ['header', Validators.required]
    });
  }

  get totalAds(): number {
    return this.advertisements.length;
  }

  get activeAds(): number {
    return this.advertisements.filter(ad => ad.status === 'active').length;
  }

  get scheduledAds(): number {
    return this.advertisements.filter(ad => ad.status === 'scheduled').length;
  }

  getStatusClass(status: AdvertisementStatus): string {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'paused':
        return 'bg-warning';
      case 'scheduled':
        return 'bg-info';
      case 'ended':
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  }

  toggleStatus(ad: Advertisement): void {
    const newStatus: AdvertisementStatus = ad.status === 'active' ? 'paused' : 'active';
    
    this.adService.updateAdvertisement({ ...ad, status: newStatus })
      .subscribe({
        next: () => {
          this.showSuccessMessage(`Publicité ${newStatus === 'active' ? 'activée' : 'mise en pause'}`);
        },
        error: (error) => {
          this.showErrorMessage('Erreur lors de la mise à jour du statut');
          console.error('Error:', error);
        }
      });
  }

  getToggleButtonIcon(status: AdvertisementStatus): string {
    return status === 'active' ? 'pause' : 'play_arrow';
  }

  formatCTR(ctr: number): string {
    return ctr.toFixed(2);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImageUrl;
  }

  ngOnInit(): void {
    this.loadAdvertisements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAdvertisements(): void {
    this.loading = true;
    this.adService.advertisements$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (advertisements: Advertisement[]) => {
        this.advertisements = advertisements;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
        this.showErrorMessage('Erreur lors du chargement des publicités');
      }
    });
  }

  onSubmit(): void {
    if (this.adForm.valid) {
      const formValue = this.adForm.value;
      const newAd: CreateAdvertisementDTO = {
        ...formValue,
        status: 'active',
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        statistics: {
          views: 0,
          clicks: 0,
          clickThroughRate: 0,
          revenue: 0
        }
      };

      this.adService.createAdvertisement(newAd).subscribe({
        next: () => {
          this.adForm.reset({
            type: 'banner',
            position: 'header'
          });
        },
        error: (error) => {
          console.error('Error creating advertisement:', error);
          this.error = 'Error creating advertisement';
        }
      });
    }
  }

  editAd(ad: Advertisement): void {
    this.adForm.patchValue({
      ...ad,
      startDate: ad.startDate,
      endDate: ad.endDate
    });
  }

  duplicateAd(ad: Advertisement): void {
    const duplicatedAd: CreateAdvertisementDTO = {
      title: `${ad.title} (copie)`,
      description: ad.description,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      startDate: new Date(),
      endDate: new Date(ad.endDate),
      type: ad.type,
      position: ad.position,
      status: 'paused',
      targetAudience: [...(ad.targetAudience || [])]
    };

    this.adService.createAdvertisement(duplicatedAd).subscribe(
      () => {},
      error => {
        console.error('Error duplicating advertisement:', error);
        this.error = 'Error duplicating advertisement';
      }
    );
  }

  deleteAd(id: string): void {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      this.adService.deleteAdvertisement(id).subscribe(
        () => {},
        error => {
          console.error('Error deleting advertisement:', error);
          this.error = 'Error deleting advertisement';
        }
      );
    }
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
