import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementFormDialogComponent } from '../advertisement-form/advertisement-form-dialog.component';

@Component({
  selector: 'app-advertisement-management',
  template: `
    <div class="ads-management-container">
      <div class="header">
        <h1>Gestion des publicités</h1>
        <button mat-raised-button color="primary" (click)="openAdDialog()">
          <mat-icon>add</mat-icon>
          Nouvelle publicité
        </button>
      </div>

      <mat-card class="stats-card">
        <mat-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ advertisements.length }}</div>
              <div class="stat-label">Total</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getActiveAdsCount() }}</div>
              <div class="stat-label">Actives</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getScheduledAdsCount() }}</div>
              <div class="stat-label">Planifiées</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getEndedAdsCount() }}</div>
              <div class="stat-label">Terminées</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          <table mat-table [dataSource]="advertisements" class="ads-table">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Titre</th>
              <td mat-cell *matCellDef="let ad" (click)="navigateToAd(ad)" [style.cursor]="'pointer'" class="ad-title">
                {{ ad.title }}
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let ad">
                <span [class]="'type-badge ' + ad.type">{{ getTypeLabel(ad.type) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="startDate">
              <th mat-header-cell *matHeaderCellDef>Date de début</th>
              <td mat-cell *matCellDef="let ad">{{ ad.startDate | date:'shortDate' }}</td>
            </ng-container>

            <ng-container matColumnDef="endDate">
              <th mat-header-cell *matHeaderCellDef>Date de fin</th>
              <td mat-cell *matCellDef="let ad">{{ ad.endDate | date:'shortDate' }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let ad">
                <span [class]="'status-badge ' + ad.status">{{ getStatusLabel(ad.status) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let ad">
                <button mat-icon-button color="primary" (click)="editAd(ad)" matTooltip="Modifier">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteAd(ad)" matTooltip="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .ads-management-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .stats-card {
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding: 1rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 500;
      color: #3f51b5;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 1rem;
    }

    .table-card {
      overflow: hidden;
    }

    .ads-table {
      width: 100%;
    }

    .mat-column-actions {
      width: 100px;
      text-align: center;
    }

    .status-badge, .type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.scheduled {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.ended {
      background-color: #fafafa;
      color: #616161;
    }

    .status-badge.paused {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .type-badge.banner {
      background-color: #e8eaf6;
      color: #3f51b5;
    }

    .type-badge.video {
      background-color: #fce4ec;
      color: #c2185b;
    }

    .type-badge.sponsored {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    tr.mat-row:hover {
      background-color: #f5f5f5;
    }

    .mat-column-title {
      min-width: 200px;
    }

    .mat-column-type, .mat-column-status {
      min-width: 120px;
    }

    .mat-column-startDate, .mat-column-endDate {
      min-width: 100px;
    }

    .ad-title {
      color: #1976d2;
      text-decoration: none;
    }
    
    .ad-title:hover {
      text-decoration: underline;
      color: #1565c0;
    }
  `]
})
export class AdvertisementManagementComponent implements OnInit {
  advertisements: Advertisement[] = [];
  displayedColumns = ['title', 'type', 'startDate', 'endDate', 'status', 'actions'];

  constructor(
    private adService: AdvertisementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAdvertisements();
  }

  loadAdvertisements() {
    this.adService.getAdvertisements().subscribe({
      next: (ads) => {
        this.advertisements = ads;
      },
      error: () => {
        this.showNotification('Erreur lors du chargement des publicités', true);
      }
    });
  }

  openAdDialog(ad?: Advertisement) {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '600px',
      data: { ad }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (ad?.id) {
          this.updateAd(ad, result);
        } else {
          this.createAd(result);
        }
      }
    });
  }

  editAd(ad: Advertisement) {
    this.openAdDialog(ad);
  }

  private createAd(adData: Omit<Advertisement, 'id'>) {
    this.adService.createAdvertisement(adData).subscribe({
      next: (newAd) => {
        this.advertisements = [...this.advertisements, newAd];
        this.showNotification('Publicité créée avec succès');
      },
      error: () => {
        this.showNotification('Erreur lors de la création de la publicité', true);
      }
    });
  }

  private updateAd(ad: Advertisement, updates: Partial<Advertisement>) {
    if (!ad.id) return;
    
    this.adService.updateAdvertisement(ad.id, updates).subscribe({
      next: (updatedAd) => {
        if (updatedAd) {
          const index = this.advertisements.findIndex(a => a.id === ad.id);
          if (index !== -1) {
            this.advertisements = [
              ...this.advertisements.slice(0, index),
              updatedAd,
              ...this.advertisements.slice(index + 1)
            ];
          }
          this.showNotification('Publicité mise à jour avec succès');
        }
      },
      error: () => {
        this.showNotification('Erreur lors de la mise à jour de la publicité', true);
      }
    });
  }

  deleteAd(ad: Advertisement) {
    if (!ad.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      this.adService.deleteAdvertisement(ad.id).subscribe({
        next: (success) => {
          if (success) {
            this.advertisements = this.advertisements.filter(a => a.id !== ad.id);
            this.showNotification('Publicité supprimée avec succès');
          }
        },
        error: () => {
          this.showNotification('Erreur lors de la suppression de la publicité', true);
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

  getTypeLabel(type: string): string {
    switch (type) {
      case 'banner':
        return 'Bannière';
      case 'video':
        return 'Vidéo';
      case 'sponsored':
        return 'Sponsorisé';
      default:
        return type;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'paused':
        return 'En pause';
      case 'scheduled':
        return 'Planifié';
      case 'ended':
        return 'Terminé';
      default:
        return status;
    }
  }

  getActiveAdsCount(): number {
    return this.advertisements.filter(ad => ad.status === 'active').length;
  }

  getScheduledAdsCount(): number {
    return this.advertisements.filter(ad => ad.status === 'scheduled').length;
  }

  getEndedAdsCount(): number {
    return this.advertisements.filter(ad => ad.status === 'ended').length;
  }

  private showNotification(message: string, isError = false) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
