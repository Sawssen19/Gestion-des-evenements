import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-ad-statistics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule
  ],
  template: `
    <div class="stats-container">
      <div class="stats-header">
        <h1>Statistiques des Annonces</h1>
        <div class="stats-actions">
          <mat-form-field appearance="outline">
            <mat-label>Période</mat-label>
            <mat-select [(ngModel)]="selectedPeriod" (selectionChange)="onPeriodChange()">
              <mat-option value="day">Aujourd'hui</mat-option>
              <mat-option value="week">Cette semaine</mat-option>
              <mat-option value="month">Ce mois</mat-option>
              <mat-option value="year">Cette année</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div class="stats-summary">
        <mat-card>
          <mat-card-content>
            <div class="stat-value">{{ calculateTotalViews() }}</div>
            <div class="stat-label">Vues totales</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="stat-value">{{ calculateTotalClicks() }}</div>
            <div class="stat-label">Clics totaux</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="stat-value">{{ calculateAverageClickThroughRate().toFixed(2) }}%</div>
            <div class="stat-label">CTR moyen</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="stat-value">{{ calculateTotalRevenue().toFixed(2) }}€</div>
            <div class="stat-label">Revenus totaux</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="stats-table">
        <mat-card-content>
          <table mat-table [dataSource]="advertisements">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Titre</th>
              <td mat-cell *matCellDef="let ad">{{ ad.title }}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let ad">{{ ad.type | titlecase }}</td>
            </ng-container>

            <ng-container matColumnDef="views">
              <th mat-header-cell *matHeaderCellDef>Vues</th>
              <td mat-cell *matCellDef="let ad">{{ ad.statistics.views }}</td>
            </ng-container>

            <ng-container matColumnDef="clicks">
              <th mat-header-cell *matHeaderCellDef>Clics</th>
              <td mat-cell *matCellDef="let ad">{{ ad.statistics.clicks }}</td>
            </ng-container>

            <ng-container matColumnDef="ctr">
              <th mat-header-cell *matHeaderCellDef>CTR</th>
              <td mat-cell *matCellDef="let ad">{{ ad.statistics.clickThroughRate.toFixed(2) }}%</td>
            </ng-container>

            <ng-container matColumnDef="revenue">
              <th mat-header-cell *matHeaderCellDef>Revenus</th>
              <td mat-cell *matCellDef="let ad">{{ ad.statistics.revenue.toFixed(2) }}€</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stats-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      background-color: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stats-header h1 {
      font-size: 2.5em;
      margin: 0;
      color: #2c3e50;
      font-weight: 500;
    }

    .stats-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stats-summary mat-card {
      text-align: center;
      padding: 24px;
    }

    .stat-value {
      font-size: 2em;
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .stat-label {
      color: rgba(0,0,0,0.6);
      font-size: 1.1em;
    }

    .stats-table {
      margin-top: 24px;
    }

    table {
      width: 100%;
    }

    th.mat-header-cell {
      font-weight: 500;
      color: #2c3e50;
    }

    .mat-column-title {
      min-width: 200px;
    }

    .mat-column-type {
      min-width: 100px;
    }

    @media (max-width: 600px) {
      .stats-header {
        flex-direction: column;
        gap: 16px;
      }

      .stats-summary {
        grid-template-columns: 1fr;
      }

      .stats-table {
        overflow-x: auto;
      }
    }
  `]
})
export class AdStatisticsComponent implements OnInit {
  advertisements: Advertisement[] = [];
  selectedPeriod = 'month';
  displayedColumns = ['title', 'type', 'views', 'clicks', 'ctr', 'revenue'];

  constructor(private adService: AdvertisementService) {}

  ngOnInit() {
    this.loadAdvertisements();
  }

  loadAdvertisements() {
    this.adService.getAdvertisements().subscribe((ads: Advertisement[]) => {
      this.advertisements = ads;
    });
  }

  onPeriodChange() {
    // Dans une vraie application, nous filtrerions les données en fonction de la période sélectionnée
    this.loadAdvertisements();
  }

  calculateTotalViews(): number {
    return this.advertisements
      .filter(ad => ad.statistics)
      .reduce((sum, ad) => sum + (ad.statistics?.views || 0), 0);
  }

  calculateTotalClicks(): number {
    return this.advertisements
      .filter(ad => ad.statistics)
      .reduce((sum, ad) => sum + (ad.statistics?.clicks || 0), 0);
  }

  calculateAverageClickThroughRate(): number {
    const validAds = this.advertisements.filter(ad => ad.statistics);
    if (validAds.length === 0) return 0;
    
    return validAds
      .reduce((sum, ad) => sum + (ad.statistics?.clickThroughRate || 0), 0) / validAds.length;
  }

  calculateTotalRevenue(): number {
    return this.advertisements
      .filter(ad => ad.statistics)
      .reduce((sum, ad) => sum + (ad.statistics?.revenue || 0), 0);
  }
}
