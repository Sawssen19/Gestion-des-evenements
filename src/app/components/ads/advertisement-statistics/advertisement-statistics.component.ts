import { Component, OnInit } from '@angular/core';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-advertisement-statistics',
  template: `
    <div class="statistics-container">
      <h2>Statistiques des publicités</h2>
      
      <div class="stats-summary">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Total des impressions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ totalImpressions }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Total des clics</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ totalClicks }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Taux d'engagement moyen</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ averageEngagement | number:'1.1-2' }}%</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="performance-table">
        <mat-card-header>
          <mat-card-title>Performance des publicités</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="advertisements">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Titre</th>
              <td mat-cell *matCellDef="let ad">{{ ad.title }}</td>
            </ng-container>

            <ng-container matColumnDef="impressions">
              <th mat-header-cell *matHeaderCellDef>Impressions</th>
              <td mat-cell *matCellDef="let ad">{{ ad.impressions || 0 }}</td>
            </ng-container>

            <ng-container matColumnDef="clicks">
              <th mat-header-cell *matHeaderCellDef>Clics</th>
              <td mat-cell *matCellDef="let ad">{{ ad.clicks || 0 }}</td>
            </ng-container>

            <ng-container matColumnDef="engagement">
              <th mat-header-cell *matHeaderCellDef>Engagement</th>
              <td mat-cell *matCellDef="let ad">{{ ad.engagement || 0 | number:'1.1-2' }}%</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .statistics-container {
      padding: 24px;
    }

    .stats-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #1976d2;
      text-align: center;
      padding: 16px 0;
    }

    .performance-table {
      margin-top: 24px;
    }

    table {
      width: 100%;
    }

    th.mat-header-cell {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.87);
    }

    .mat-column-title {
      padding-right: 24px;
    }

    .mat-row:hover {
      background: #f5f5f5;
    }
  `]
})
export class AdvertisementStatisticsComponent implements OnInit {
  advertisements: Advertisement[] = [];
  displayedColumns: string[] = ['title', 'impressions', 'clicks', 'engagement'];
  totalImpressions = 0;
  totalClicks = 0;
  averageEngagement = 0;

  constructor(private adService: AdvertisementService) {}

  ngOnInit() {
    this.loadStatistics();
  }

  private loadStatistics() {
    this.adService.getAdvertisements().subscribe(ads => {
      this.advertisements = ads;
      this.calculateStatistics();
    });
  }

  private calculateStatistics() {
    this.totalImpressions = this.advertisements.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
    this.totalClicks = this.advertisements.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    this.averageEngagement = this.totalImpressions > 0 
      ? (this.totalClicks / this.totalImpressions) * 100 
      : 0;
  }
}
