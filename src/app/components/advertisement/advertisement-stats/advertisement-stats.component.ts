import { Component, OnInit, OnDestroy, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdvertisementService } from '../../../services/advertisement.service';
import { Advertisement } from '../../../models/advertisement.model';

interface TypeStats {
  type: string;
  count: number;
  views: number;
  clicks: number;
  ctr: number;
  revenue: number;
}

interface PositionStats {
  position: string;
  count: number;
  views: number;
  clicks: number;
  ctr: number;
  revenue: number;
}

@Component({
  selector: 'app-advertisement-stats',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
  ],
  template: `
    <div class="container-fluid p-4">
      <h2 class="mb-4">Statistiques des Publicités</h2>

      <mat-tab-group>
        <!-- Vue d'ensemble -->
        <mat-tab label="Vue d'ensemble">
          <div class="tab-content">
            <mat-card class="mb-4">
              <mat-card-header>
                <mat-card-title>État des publicités</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <mat-grid-list cols="4" rowHeight="100px">
                  <mat-grid-tile>
                    <div class="stat-box">
                      <div class="stat-icon">
                        <mat-icon>ads_click</mat-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">{{ totalAds }}</div>
                        <div class="stat-label">Total des publicités</div>
                      </div>
                    </div>
                  </mat-grid-tile>
                  <mat-grid-tile>
                    <div class="stat-box">
                      <div class="stat-icon active">
                        <mat-icon>play_circle</mat-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">{{ activeAds }}</div>
                        <div class="stat-label">Publicités actives</div>
                      </div>
                    </div>
                  </mat-grid-tile>
                  <mat-grid-tile>
                    <div class="stat-box">
                      <div class="stat-icon paused">
                        <mat-icon>pause_circle</mat-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">{{ pausedAds }}</div>
                        <div class="stat-label">Publicités en pause</div>
                      </div>
                    </div>
                  </mat-grid-tile>
                  <mat-grid-tile>
                    <div class="stat-box">
                      <div class="stat-icon scheduled">
                        <mat-icon>schedule</mat-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">{{ scheduledAds }}</div>
                        <div class="stat-label">Publicités planifiées</div>
                      </div>
                    </div>
                  </mat-grid-tile>
                </mat-grid-list>
              </mat-card-content>
            </mat-card>

            <mat-card class="mb-4">
              <mat-card-header>
                <mat-card-title>Performance globale</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <mat-grid-list cols="4" rowHeight="100px">
                  <mat-grid-tile>
                    <div class="stat-box">
                      <div class="stat-icon">
                        <mat-icon>visibility</mat-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">{{ totalViews | number }}</div>
                        <div class="stat-label">Vues totales</div>
                      </div>
                    </div>
                  </mat-grid-tile>
                  <mat-grid-tile>
                    <div class="stat-box">
                      <div class="stat-icon">
                        <mat-icon>touch_app</mat-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">{{ totalClicks | number }}</div>
                        <div class="stat-label">Clics totaux</div>
                      </div>
                    </div>
                  </mat-grid-tile>
                  <mat-grid-tile>
                    <div class="stat-box">
                      <div class="stat-icon">
                        <mat-icon>trending_up</mat-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">{{ averageCTR | number:'1.2-2' }}%</div>
                        <div class="stat-label">Taux de clic moyen</div>
                      </div>
                    </div>
                  </mat-grid-tile>
                  <mat-grid-tile>
                    <div class="stat-box">
                      <div class="stat-icon">
                        <mat-icon>euro</mat-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">{{ totalRevenue | currency:'EUR':'symbol':'1.2-2' }}</div>
                        <div class="stat-label">Revenus totaux</div>
                      </div>
                    </div>
                  </mat-grid-tile>
                </mat-grid-list>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Statistiques par type -->
        <mat-tab label="Par type">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Performance par type de publicité</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="typeStats" matSort class="w-100">
                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
                    <td mat-cell *matCellDef="let item">{{ item.type }}</td>
                  </ng-container>

                  <ng-container matColumnDef="count">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                    <td mat-cell *matCellDef="let item">{{ item.count }}</td>
                  </ng-container>

                  <ng-container matColumnDef="views">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Vues</th>
                    <td mat-cell *matCellDef="let item">{{ item.views | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="clicks">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Clics</th>
                    <td mat-cell *matCellDef="let item">{{ item.clicks | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="ctr">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>CTR</th>
                    <td mat-cell *matCellDef="let item">{{ item.ctr | number:'1.2-2' }}%</td>
                  </ng-container>

                  <ng-container matColumnDef="revenue">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Revenus</th>
                    <td mat-cell *matCellDef="let item">{{ item.revenue | currency:'EUR':'symbol':'1.2-2' }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Statistiques par position -->
        <mat-tab label="Par position">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Performance par position</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="positionStats" matSort class="w-100">
                  <ng-container matColumnDef="position">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Position</th>
                    <td mat-cell *matCellDef="let item">{{ item.position }}</td>
                  </ng-container>

                  <ng-container matColumnDef="count">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                    <td mat-cell *matCellDef="let item">{{ item.count }}</td>
                  </ng-container>

                  <ng-container matColumnDef="views">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Vues</th>
                    <td mat-cell *matCellDef="let item">{{ item.views | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="clicks">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Clics</th>
                    <td mat-cell *matCellDef="let item">{{ item.clicks | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="ctr">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>CTR</th>
                    <td mat-cell *matCellDef="let item">{{ item.ctr | number:'1.2-2' }}%</td>
                  </ng-container>

                  <ng-container matColumnDef="revenue">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Revenus</th>
                    <td mat-cell *matCellDef="let item">{{ item.revenue | currency:'EUR':'symbol':'1.2-2' }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Meilleures performances -->
        <mat-tab label="Top performances">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Top 10 des publicités</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <mat-form-field>
                  <mat-label>Trier par</mat-label>
                  <mat-select [(ngModel)]="sortMetric" (selectionChange)="updateTopAds()">
                    <mat-option value="views">Vues</mat-option>
                    <mat-option value="clicks">Clics</mat-option>
                    <mat-option value="ctr">Taux de clic</mat-option>
                    <mat-option value="revenue">Revenus</mat-option>
                  </mat-select>
                </mat-form-field>

                <table mat-table [dataSource]="topAds" class="w-100">
                  <ng-container matColumnDef="title">
                    <th mat-header-cell *matHeaderCellDef>Titre</th>
                    <td mat-cell *matCellDef="let ad">{{ ad.title }}</td>
                  </ng-container>

                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef>Type</th>
                    <td mat-cell *matCellDef="let ad">{{ ad.type }}</td>
                  </ng-container>

                  <ng-container matColumnDef="views">
                    <th mat-header-cell *matHeaderCellDef>Vues</th>
                    <td mat-cell *matCellDef="let ad">{{ ad.statistics.views | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="clicks">
                    <th mat-header-cell *matHeaderCellDef>Clics</th>
                    <td mat-cell *matCellDef="let ad">{{ ad.statistics.clicks | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="ctr">
                    <th mat-header-cell *matHeaderCellDef>CTR</th>
                    <td mat-cell *matCellDef="let ad">{{ (ad.statistics.clicks / ad.statistics.views * 100) | number:'1.2-2' }}%</td>
                  </ng-container>

                  <ng-container matColumnDef="revenue">
                    <th mat-header-cell *matHeaderCellDef>Revenus</th>
                    <td mat-cell *matCellDef="let ad">{{ ad.statistics.revenue | currency:'EUR':'symbol':'1.2-2' }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="topAdsColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: topAdsColumns;"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .container-fluid {
      padding: 24px;
      height: 100%;
      overflow-y: auto;
    }

    ::ng-deep .mat-tab-header {
      background-color: white;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 24px;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    ::ng-deep .mat-tab-label {
      height: 48px;
      padding: 0 24px;
      opacity: 1;
      color: #666;
      font-weight: 500;
    }

    ::ng-deep .mat-tab-label-active {
      color: #1976d2;
    }

    ::ng-deep .mat-ink-bar {
      background-color: #1976d2 !important;
      height: 3px !important;
    }

    ::ng-deep .mat-tab-label:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    ::ng-deep .mat-tab-header-pagination {
      display: none;
    }

    ::ng-deep .mat-tab-labels {
      background-color: white;
    }

    .tab-content {
      padding: 24px 0;
    }

    mat-tab-group {
      height: 100%;
    }

    .stat-box {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      width: 100%;
      height: 100%;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #f5f5f5;
    }

    .stat-icon.active {
      background-color: #e8f5e9;
      color: #4caf50;
    }

    .stat-icon.paused {
      background-color: #fff3e0;
      color: #ff9800;
    }

    .stat-icon.scheduled {
      background-color: #e3f2fd;
      color: #2196f3;
    }

    .stat-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 500;
      line-height: 1.2;
      color: #333;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }

    mat-card {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    mat-card-header {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    mat-card-title {
      font-size: 18px !important;
      margin: 0 !important;
    }

    mat-card-content {
      padding: 16px;
    }

    table {
      width: 100%;
    }

    .mat-column-type,
    .mat-column-position {
      min-width: 120px;
    }

    .mat-column-count {
      min-width: 80px;
    }

    .mat-column-views,
    .mat-column-clicks {
      min-width: 100px;
    }

    .mat-column-ctr {
      min-width: 80px;
    }

    .mat-column-revenue {
      min-width: 120px;
    }

    mat-form-field {
      width: 200px;
      margin-bottom: 16px;
    }
  `]
})
export class AdvertisementStatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Statistiques générales
  totalAds: number = 0;
  activeAds: number = 0;
  pausedAds: number = 0;
  scheduledAds: number = 0;

  // Statistiques de performance
  totalViews: number = 0;
  totalClicks: number = 0;
  averageCTR: number = 0;
  totalRevenue: number = 0;
  averageRevenuePerAd: number = 0;

  // Statistiques par type et position
  typeStats: TypeStats[] = [];
  positionStats: PositionStats[] = [];
  displayedColumns: string[] = ['type', 'count', 'views', 'clicks', 'ctr', 'revenue'];

  // Top performances
  topAds: Advertisement[] = [];
  topAdsColumns: string[] = ['title', 'type', 'views', 'clicks', 'ctr', 'revenue'];
  sortMetric: 'views' | 'clicks' | 'ctr' | 'revenue' = 'views';

  constructor(private adService: AdvertisementService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStatistics(): void {
    this.adService.getAdvertisements()
      .pipe(takeUntil(this.destroy$))
      .subscribe(ads => {
        this.calculateGeneralStats(ads);
        this.calculateTypeStats(ads);
        this.calculatePositionStats(ads);
        this.updateTopAds(ads);
      });
  }

  private calculateGeneralStats(ads: Advertisement[]): void {
    // Statistiques générales
    this.totalAds = ads.length;
    this.activeAds = ads.filter(ad => ad.status === 'active').length;
    this.pausedAds = ads.filter(ad => ad.status === 'paused').length;
    this.scheduledAds = ads.filter(ad => ad.status === 'scheduled').length;

    // Statistiques de performance
    this.totalViews = ads.reduce((sum, ad) => sum + (ad.statistics?.views || 0), 0);
    this.totalClicks = ads.reduce((sum, ad) => sum + (ad.statistics?.clicks || 0), 0);
    this.totalRevenue = ads.reduce((sum, ad) => sum + (ad.statistics?.revenue || 0), 0);

    // Calculs moyens
    this.averageCTR = this.totalViews > 0 
      ? (this.totalClicks / this.totalViews) * 100 
      : 0;
    
    this.averageRevenuePerAd = this.totalAds > 0 
      ? this.totalRevenue / this.totalAds 
      : 0;
  }

  private calculateTypeStats(ads: Advertisement[]): void {
    const typeMap = new Map<string, TypeStats>();

    ads.forEach(ad => {
      const existing = typeMap.get(ad.type) || {
        type: ad.type,
        count: 0,
        views: 0,
        clicks: 0,
        ctr: 0,
        revenue: 0
      };

      existing.count++;
      existing.views += ad.statistics?.views || 0;
      existing.clicks += ad.statistics?.clicks || 0;
      existing.revenue += ad.statistics?.revenue || 0;
      existing.ctr = existing.views > 0 ? (existing.clicks / existing.views) * 100 : 0;

      typeMap.set(ad.type, existing);
    });

    this.typeStats = Array.from(typeMap.values());
  }

  private calculatePositionStats(ads: Advertisement[]): void {
    const positionMap = new Map<string, PositionStats>();

    ads.forEach(ad => {
      const existing = positionMap.get(ad.position) || {
        position: ad.position,
        count: 0,
        views: 0,
        clicks: 0,
        ctr: 0,
        revenue: 0
      };

      existing.count++;
      existing.views += ad.statistics?.views || 0;
      existing.clicks += ad.statistics?.clicks || 0;
      existing.revenue += ad.statistics?.revenue || 0;
      existing.ctr = existing.views > 0 ? (existing.clicks / existing.views) * 100 : 0;

      positionMap.set(ad.position, existing);
    });

    this.positionStats = Array.from(positionMap.values());
  }

  updateTopAds(ads?: Advertisement[]): void {
    const currentAds = ads || this.topAds;
    
    this.topAds = [...currentAds]
      .sort((a, b) => {
        switch (this.sortMetric) {
          case 'views':
            return (b.statistics?.views || 0) - (a.statistics?.views || 0);
          case 'clicks':
            return (b.statistics?.clicks || 0) - (a.statistics?.clicks || 0);
          case 'ctr':
            const ctrA = a.statistics?.views ? (a.statistics.clicks / a.statistics.views) : 0;
            const ctrB = b.statistics?.views ? (b.statistics.clicks / b.statistics.views) : 0;
            return ctrB - ctrA;
          case 'revenue':
            return (b.statistics?.revenue || 0) - (a.statistics?.revenue || 0);
          default:
            return 0;
        }
      })
      .slice(0, 10);
  }
}
