import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementFormDialogComponent } from '../advertisement-form/advertisement-form-dialog.component';

@Component({
  selector: 'app-advertisement-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="ad-container">
      <div class="ad-header">
        <h1>Annonces</h1>
        <div class="ad-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Filtrer par type</mat-label>
            <mat-select [(ngModel)]="selectedType" (selectionChange)="filterByType()">
              <mat-option value="">Tous</mat-option>
              <mat-option value="banner">Bannière</mat-option>
              <mat-option value="video">Vidéo</mat-option>
              <mat-option value="sponsored">Sponsorisé</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openCreateDialog()" class="create-button">
            <mat-icon>add</mat-icon>
            Nouvelle annonce
          </button>
        </div>
      </div>

      <div class="ad-grid">
        <mat-card *ngFor="let ad of advertisements" class="ad-card fade-in">
          <mat-card-header>
            <mat-card-title>{{ ad.title }}</mat-card-title>
            <mat-card-subtitle>
              <div class="ad-meta">
                <span class="ad-type" [class]="ad.type">
                  <mat-icon>{{ getTypeIcon(ad.type) }}</mat-icon>
                  {{ ad.type | titlecase }}
                </span>
                <span [class]="'status-' + ad.status">
                  {{ ad.status | titlecase }}
                </span>
              </div>
            </mat-card-subtitle>
          </mat-card-header>

          <img *ngIf="ad.imageUrl" mat-card-image [src]="ad.imageUrl" [alt]="ad.title" class="ad-image">

          <mat-card-content>
            <p class="ad-description">{{ ad.description }}</p>
            <div class="ad-details">
              <div class="detail-item">
                <mat-icon>calendar_today</mat-icon>
                <span>{{ ad.startDate | date }} - {{ ad.endDate | date }}</span>
              </div>
              <div class="detail-item">
                <mat-icon>location_on</mat-icon>
                <span>{{ ad.location }}</span>
              </div>
            </div>
            <mat-chip-grid>
              <mat-chip-row *ngFor="let audience of ad.targetAudience" color="accent" selected>
                {{ audience }}
              </mat-chip-row>
            </mat-chip-grid>
            <div class="stats">
              <div class="stat">
                <span class="stat-label">Vues</span>
                <span class="stat-value">{{ ad.statistics?.views || 0 }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Clics</span>
                <span class="stat-value">{{ ad.statistics?.clicks || 0 }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Taux de clics</span>
                <span class="stat-value">{{ ad.statistics?.clickThroughRate || 0 }}%</span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <a mat-button color="primary" [href]="ad.linkUrl" target="_blank">
              Voir l'annonce
            </a>
            <button mat-button (click)="editAdvertisement(ad)">Modifier</button>
            <button mat-button color="warn" (click)="deleteAdvertisement(ad)" [disabled]="!ad.id">Supprimer</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="advertisements.length === 0" class="no-ads">
        <mat-icon>campaign</mat-icon>
        <p>Aucune annonce trouvée</p>
      </div>
    </div>
  `,
  styles: [`
    .ad-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
      background-color: #f8f9fa;
    }

    .ad-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      background-color: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .ad-header h1 {
      font-size: 2.5em;
      margin: 0;
      color: #2c3e50;
      font-weight: 500;
    }

    .ad-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .search-field {
      width: 200px;
    }

    .create-button {
      height: 48px;
      padding: 0 24px;
    }

    .ad-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .ad-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .ad-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .ad-image {
      height: 200px;
      object-fit: cover;
    }

    .ad-meta {
      display: flex;
      gap: 16px;
      margin: 8px 0;
    }

    .ad-type {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9em;
    }

    .banner {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .video {
      background-color: #f3e5f5;
      color: #9c27b0;
    }

    .sponsored {
      background-color: #e8f5e9;
      color: #43a047;
    }

    .status-active {
      color: #43a047;
    }

    .status-inactive {
      color: #e53935;
    }

    .status-pending {
      color: #fb8c00;
    }

    .ad-description {
      margin: 16px 0;
      color: #2c3e50;
      line-height: 1.6;
    }

    .ad-details {
      margin: 16px 0;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: rgba(0,0,0,0.6);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 16px 0;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-label {
      font-size: 0.9em;
      color: rgba(0,0,0,0.6);
    }

    .stat-value {
      font-size: 1.2em;
      font-weight: 500;
      color: #2c3e50;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 8px 16px;
      margin: 0;
      gap: 8px;
    }

    .no-ads {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .no-ads mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #95a5a6;
    }

    .no-ads p {
      font-size: 1.2em;
      color: #95a5a6;
      margin: 0;
    }

    .fade-in {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 600px) {
      .ad-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .ad-actions {
        flex-direction: column;
      }

      .search-field {
        width: 100%;
      }

      .ad-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdvertisementListComponent implements OnInit {
  advertisements: Advertisement[] = [];
  filteredAdvertisements: Advertisement[] = [];
  selectedType = '';

  constructor(
    private adService: AdvertisementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAdvertisements();
  }

  loadAdvertisements() {
    this.adService.getAdvertisements().subscribe((ads: Advertisement[]) => {
      this.advertisements = ads;
      this.filteredAdvertisements = ads;
    });
  }

  filterByType() {
    if (this.selectedType) {
      this.adService.getAdvertisementsByType(this.selectedType).subscribe((ads: Advertisement[]) => {
        this.filteredAdvertisements = ads;
      });
    } else {
      this.loadAdvertisements();
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'banner':
        return 'view_carousel';
      case 'video':
        return 'videocam';
      case 'sponsored':
        return 'star';
      default:
        return 'campaign';
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '800px',
      data: { isEditing: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createAdvertisement(result);
      }
    });
  }

  createAdvertisement(result: Omit<Advertisement, 'id'>) {
    if (result) {
      this.adService.createAdvertisement(result).subscribe({
        next: () => {
          this.loadAdvertisements();
          this.snackBar.open('Advertisement created successfully', 'Close', { duration: 3000 });
        },
        error: (error: Error) => {
          console.error('Error creating advertisement:', error);
          this.snackBar.open('Error creating advertisement', 'Close', { duration: 3000 });
        }
      });
    }
  }

  editAdvertisement(ad: Advertisement) {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '800px',
      data: { ad, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && ad.id) {
        this.updateAdvertisement(ad, result);
      }
    });
  }

  updateAdvertisement(ad: Advertisement, result: Partial<Advertisement>) {
    if (!ad.id) {
      this.snackBar.open('Cannot update advertisement without ID', 'Close', { duration: 3000 });
      return;
    }

    this.adService.updateAdvertisement(ad.id, result).subscribe({
      next: () => {
        this.loadAdvertisements();
        this.snackBar.open('Advertisement updated successfully', 'Close', { duration: 3000 });
      },
      error: (error: Error) => {
        console.error('Error updating advertisement:', error);
        this.snackBar.open('Error updating advertisement', 'Close', { duration: 3000 });
      }
    });
  }

  deleteAdvertisement(ad: Advertisement) {
    if (!ad.id) {
      this.snackBar.open('Cannot delete advertisement without ID', 'Close', { duration: 3000 });
      return;
    }

    this.adService.deleteAdvertisement(ad.id).subscribe({
      next: () => {
        this.loadAdvertisements();
        this.snackBar.open('Advertisement deleted successfully', 'Close', { duration: 3000 });
      },
      error: (error: Error) => {
        console.error('Error deleting advertisement:', error);
        this.snackBar.open('Error deleting advertisement', 'Close', { duration: 3000 });
      }
    });
  }
}
