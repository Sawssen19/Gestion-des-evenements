import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Advertisement, AdvertisementStatus, AdvertisementType, CreateAdvertisementDTO } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementFormDialogComponent } from '../advertisement-form/advertisement-form-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-advertisement-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    FormsModule
  ],
  template: `
    <div class="ads-container">
      <!-- Header avec statistiques -->
      <div class="ads-header">
        <div class="stats-cards">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value">{{ totalAds }}</div>
              <div class="stat-label">Total Publicités</div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value">{{ activeAds }}</div>
              <div class="stat-label">Publicités Actives</div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value">{{ inactiveAds }}</div>
              <div class="stat-label">Publicités Inactives</div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Filtres et Actions -->
      <div class="filters-actions">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
              <mat-option value="all">Tous</mat-option>
              <mat-option value="active">Actif</mat-option>
              <mat-option value="inactive">Inactif</mat-option>
              <mat-option value="scheduled">Planifié</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
              <mat-option value="all">Tous</mat-option>
              <mat-option value="banner">Bannière</mat-option>
              <mat-option value="video">Vidéo</mat-option>
              <mat-option value="sponsored">Sponsorisé</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Position</mat-label>
            <mat-select [(ngModel)]="selectedPosition" (selectionChange)="applyFilters()">
              <mat-option value="all">Toutes</mat-option>
              <mat-option value="header">En-tête</mat-option>
              <mat-option value="sidebar">Barre latérale</mat-option>
              <mat-option value="content">Contenu</mat-option>
              <mat-option value="footer">Pied de page</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="actions">
          <button mat-flat-button color="primary" (click)="openAdDialog()">
            <mat-icon>add</mat-icon>
            Nouvelle Publicité
          </button>
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Options">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="exportAds()">
              <mat-icon>download</mat-icon>
              <span>Exporter</span>
            </button>
            <button mat-menu-item (click)="refreshAds()">
              <mat-icon>refresh</mat-icon>
              <span>Actualiser</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Table des publicités -->
      <div class="table-container mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- Image Column -->
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef> Image </th>
            <td mat-cell *matCellDef="let ad">
              <div class="ad-image">
                <img [src]="ad.imageUrl || 'assets/images/placeholder.png'" 
                     [alt]="ad.title"
                     (error)="onImageError($event)">
              </div>
            </td>
          </ng-container>

          <!-- Title Column -->
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Titre </th>
            <td mat-cell *matCellDef="let ad">
              <div class="ad-title">
                <span>{{ ad.title }}</span>
                <mat-chip-row [class]="'status-' + ad.status">
                  {{ getStatusLabel(ad.status) }}
                </mat-chip-row>
              </div>
            </td>
          </ng-container>

          <!-- Type Column -->
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Type </th>
            <td mat-cell *matCellDef="let ad">
              <div class="ad-type">
                <mat-icon>{{ getTypeIcon(ad.type) }}</mat-icon>
                <span>{{ getTypeLabel(ad.type) }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Position Column -->
          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Position </th>
            <td mat-cell *matCellDef="let ad">{{ getPositionLabel(ad.position) }}</td>
          </ng-container>

          <!-- Dates Column -->
          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef> Dates </th>
            <td mat-cell *matCellDef="let ad">
              <div class="dates">
                <div class="date-row">
                  <mat-icon>event</mat-icon>
                  <span>{{ formatDate(ad.startDate) }}</span>
                </div>
                <div class="date-row">
                  <mat-icon>event_busy</mat-icon>
                  <span>{{ formatDate(ad.endDate) }}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let ad">
              <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                      [matTooltip]="'Options pour ' + ad.title">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #actionMenu="matMenu">
                <button mat-menu-item (click)="editAd(ad)">
                  <mat-icon>edit</mat-icon>
                  <span>Modifier</span>
                </button>
                <button mat-menu-item (click)="toggleAdStatus(ad)">
                  <mat-icon>{{ ad.status === 'active' ? 'pause' : 'play_arrow' }}</mat-icon>
                  <span>{{ ad.status === 'active' ? 'Désactiver' : 'Activer' }}</span>
                </button>
                <button mat-menu-item (click)="duplicateAd(ad)">
                  <mat-icon>content_copy</mat-icon>
                  <span>Dupliquer</span>
                </button>
                <button mat-menu-item (click)="deleteAd(ad)" class="delete-action">
                  <mat-icon>delete</mat-icon>
                  <span>Supprimer</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"
                      [pageSize]="10"
                      showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .ads-container {
      padding: 20px;
    }

    .table-container {
      margin-top: 20px;
      overflow: auto;
    }

    .ad-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
    }

    .ad-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ad-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ad-type {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dates {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .date-row mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    mat-chip-row {
      min-height: 24px;
      padding: 0 8px;
    }

    .status-active {
      background-color: #4CAF50;
      color: white;
    }

    .status-inactive {
      background-color: #9E9E9E;
      color: white;
    }

    .status-scheduled {
      background-color: #2196F3;
      color: white;
    }

    .filters-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      gap: 16px;
    }

    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    mat-form-field {
      width: 200px;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .stat-label {
      color: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class AdvertisementListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['image', 'title', 'type', 'position', 'dates', 'actions'];
  dataSource: MatTableDataSource<Advertisement>;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  selectedType: string = 'all';
  selectedStatus: string = 'all';
  selectedPosition: string = 'all';
  totalAds: number = 0;
  activeAds: number = 0;
  get inactiveAds(): number {
    return this.dataSource.data.filter(ad => ad.status === 'paused').length;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adService: AdvertisementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Advertisement>();
  }

  ngOnInit() {
    this.loadAds();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAds() {
    this.adService.getAdvertisements().pipe(takeUntil(this.destroy$)).subscribe(ads => {
      this.dataSource.data = ads;
      this.updateStats(ads);
    });
  }

  updateStats(ads: Advertisement[]) {
    this.totalAds = ads.length;
    this.activeAds = ads.filter(ad => ad.status === 'active').length;
  }

  applyFilters() {
    let filteredData = this.dataSource.data;

    if (this.selectedStatus !== 'all') {
      filteredData = filteredData.filter(ad => ad.status === this.selectedStatus);
    }

    if (this.selectedType !== 'all') {
      filteredData = filteredData.filter(ad => ad.type === this.selectedType);
    }

    if (this.selectedPosition !== 'all') {
      filteredData = filteredData.filter(ad => ad.position === this.selectedPosition);
    }

    this.dataSource.data = filteredData;
  }

  openAdDialog(ad?: Advertisement) {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '800px',
      data: { advertisement: ad }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (ad) {
          this.adService.updateAdvertisement(result).subscribe(() => this.loadAds());
        } else {
          this.adService.createAdvertisement(result).subscribe(() => this.loadAds());
        }
      }
    });
  }

  editAd(ad: Advertisement) {
    this.openAdDialog(ad);
  }

  toggleAdStatus(ad: Advertisement): void {
    const newStatus: AdvertisementStatus = ad.status === 'active' ? 'paused' : 'active';
    this.adService.updateAdvertisement({ ...ad, status: newStatus }).subscribe({
      next: () => {
        this.loadAds();
        this.showSuccessMessage(`Publicité ${newStatus === 'active' ? 'activée' : 'mise en pause'}`);
      },
      error: (error) => {
        console.error('Error updating advertisement status:', error);
        this.showErrorMessage('Erreur lors de la mise à jour du statut');
      }
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

    this.adService.createAdvertisement(duplicatedAd).subscribe(() => this.loadAds());
  }

  deleteAd(ad: Advertisement) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      this.adService.deleteAdvertisement(ad.id).subscribe(() => this.loadAds());
    }
  }

  exportAds() {
    const data = this.dataSource.data.map(ad => ({
      ...ad,
      status: this.getStatusLabel(ad.status),
      type: this.getTypeLabel(ad.type),
      position: this.getPositionLabel(ad.position)
    }));
    
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `publicites_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  refreshAds() {
    this.loadAds();
  }

  defaultImageUrl = 'https://via.placeholder.com/60x60';

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImageUrl;
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      active: 'Actif',
      inactive: 'Inactif',
      scheduled: 'Planifié'
    };
    return statusLabels[status] || status;
  }

  getTypeLabel(type: string): string {
    const typeLabels: { [key: string]: string } = {
      banner: 'Bannière',
      video: 'Vidéo',
      sponsored: 'Sponsorisé'
    };
    return typeLabels[type] || type;
  }

  getTypeIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      banner: 'view_carousel',
      video: 'play_circle',
      sponsored: 'star'
    };
    return typeIcons[type] || 'help';
  }

  getPositionLabel(position: string): string {
    const positionLabels: { [key: string]: string } = {
      header: 'En-tête',
      sidebar: 'Barre latérale',
      content: 'Contenu',
      footer: 'Pied de page'
    };
    return positionLabels[position] || position;
  }

  formatDate(date: string | Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]));
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
