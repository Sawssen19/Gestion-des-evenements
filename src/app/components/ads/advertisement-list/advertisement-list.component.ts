import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdvertisementService } from '../../../services/advertisement.service';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementFormDialogComponent } from '../advertisement-form/advertisement-form-dialog.component';

@Component({
  selector: 'app-advertisement-list',
  template: `
    <div class="ad-container">
      <div class="ad-header">
        <h1>Publicités</h1>
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
            Nouvelle publicité
          </button>
        </div>
      </div>

      <div class="ad-grid">
        <mat-card *ngFor="let ad of advertisements" class="ad-card fade-in" (click)="navigateToAd(ad)">
          <mat-card-header>
            <mat-icon mat-card-avatar [fontIcon]="getTypeIcon(ad.type)"></mat-icon>
            <mat-card-title>{{ ad.title }}</mat-card-title>
            <mat-card-subtitle>{{ ad.type | titlecase }}</mat-card-subtitle>
          </mat-card-header>
          
          <img mat-card-image *ngIf="ad.imageUrl" [src]="ad.imageUrl" [alt]="ad.title">
          
          <mat-card-content>
            <p>{{ ad.description }}</p>
            <mat-chip-list>
              <mat-chip *ngFor="let tag of ad.targetAudience">{{ tag }}</mat-chip>
            </mat-chip-list>
            <div class="ad-stats">
              <span><mat-icon>visibility</mat-icon> {{ ad.impressions }}</span>
              <span><mat-icon>touch_app</mat-icon> {{ ad.clicks }}</span>
            </div>
          </mat-card-content>
          
          <mat-card-actions align="end">
            <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Options">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="editAdvertisement(ad)">
                <mat-icon>edit</mat-icon>
                <span>Modifier</span>
              </button>
              <button mat-menu-item (click)="deleteAdvertisement(ad.id)">
                <mat-icon>delete</mat-icon>
                <span>Supprimer</span>
              </button>
            </mat-menu>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .ad-container {
      padding: 24px;
    }

    .ad-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
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
    }

    .ad-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .ad-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }

    .ad-card mat-card-content {
      flex-grow: 1;
    }

    .ad-stats {
      display: flex;
      gap: 16px;
      margin-top: 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    .ad-stats span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .ad-stats mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    mat-chip-list {
      margin-top: 8px;
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
  `]
})
export class AdvertisementListComponent implements OnInit {
  advertisements: Advertisement[] = [];
  selectedType = '';

  constructor(
    private adService: AdvertisementService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAdvertisements();
  }

  loadAdvertisements() {
    this.adService.getAdvertisements().subscribe({
      next: (ads) => {
        this.advertisements = ads;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des publicités:', error);
      }
    });
  }

  filterByType() {
    if (this.selectedType) {
      this.adService.getAdvertisementsByType(this.selectedType).subscribe({
        next: (ads) => {
          this.advertisements = ads;
        },
        error: (error) => {
          console.error('Erreur lors du filtrage des publicités:', error);
        }
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
        return 'play_circle';
      case 'sponsored':
        return 'campaign';
      default:
        return 'ads_click';
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '600px',
      data: { ad: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adService.createAdvertisement(result).subscribe({
          next: () => {
            this.loadAdvertisements();
          },
          error: (error) => {
            console.error('Erreur lors de la création de la publicité:', error);
          }
        });
      }
    });
  }

  editAdvertisement(ad: Advertisement) {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '600px',
      data: { ad }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adService.updateAdvertisement(ad.id!, result).subscribe({
          next: () => {
            this.loadAdvertisements();
          },
          error: (error) => {
            console.error('Erreur lors de la modification de la publicité:', error);
          }
        });
      }
    });
  }

  deleteAdvertisement(id: string | undefined) {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      this.adService.deleteAdvertisement(id).subscribe({
        next: () => {
          this.loadAdvertisements();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la publicité:', error);
        }
      });
    }
  }

  navigateToAd(ad: Advertisement) {
    if (ad.linkUrl && ad.id) {
      this.adService.recordClick(ad.id).subscribe(() => {
        window.open(ad.linkUrl, '_blank');
      });
    }
  }
}
