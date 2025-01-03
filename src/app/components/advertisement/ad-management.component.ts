import { Component, OnInit } from '@angular/core';
import { AdvertisementService } from '../../services/advertisement.service';
import { Advertisement } from '../../models/advertisement.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ad-management',
  template: `
    <div class="ad-management-container">
      <mat-tab-group>
        <mat-tab label="Liste des publicités">
          <div class="ad-list">
            <div class="ad-header">
              <h2>Gestion des publicités</h2>
              <button mat-raised-button color="primary" (click)="openCreateAdDialog()">
                Créer une publicité
              </button>
            </div>

            <mat-table [dataSource]="advertisements$ | async">
              <ng-container matColumnDef="title">
                <mat-header-cell *matHeaderCellDef> Titre </mat-header-cell>
                <mat-cell *matCellDef="let ad"> {{ad.title}} </mat-cell>
              </ng-container>

              <ng-container matColumnDef="type">
                <mat-header-cell *matHeaderCellDef> Type </mat-header-cell>
                <mat-cell *matCellDef="let ad"> {{ad.type}} </mat-cell>
              </ng-container>

              <ng-container matColumnDef="status">
                <mat-header-cell *matHeaderCellDef> Statut </mat-header-cell>
                <mat-cell *matCellDef="let ad"> {{ad.status}} </mat-cell>
              </ng-container>

              <ng-container matColumnDef="dates">
                <mat-header-cell *matHeaderCellDef> Période </mat-header-cell>
                <mat-cell *matCellDef="let ad">
                  {{ad.startDate | date}} - {{ad.endDate | date}}
                </mat-cell>
              </ng-container>

              <ng-container matColumnDef="actions">
                <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
                <mat-cell *matCellDef="let ad">
                  <button mat-icon-button (click)="editAd(ad)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="viewStats(ad)">
                    <mat-icon>bar_chart</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteAd(ad)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
            </mat-table>
          </div>
        </mat-tab>

        <mat-tab label="Statistiques">
          <div class="statistics-container">
            <h3>Performance des publicités</h3>
            <div class="chart-container">
              <!-- Intégration de Chart.js -->
              <canvas id="performanceChart"></canvas>
            </div>

            <div class="stats-grid">
              <mat-card *ngFor="let stat of globalStats">
                <mat-card-header>
                  <mat-card-title>{{stat.label}}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <h2>{{stat.value}}</h2>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .ad-management-container {
      padding: 20px;
    }
    .ad-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .ad-list {
      margin-top: 20px;
    }
    .statistics-container {
      padding: 20px;
    }
    .chart-container {
      height: 400px;
      margin: 20px 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
  `]
})
export class AdManagementComponent implements OnInit {
  advertisements$: Observable<Advertisement[]>;
  displayedColumns = ['title', 'type', 'status', 'dates', 'actions'];
  adForm: FormGroup;
  globalStats: any[] = [];

  constructor(
    private adService: AdvertisementService,
    private fb: FormBuilder
  ) {
    this.advertisements$ = this.adService.ads$;
    this.initForm();
  }

  ngOnInit(): void {
    this.loadGlobalStats();
  }

  private initForm(): void {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      linkUrl: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      placement: this.fb.group({
        position: [''],
        pages: [[]]
      })
    });
  }

  openCreateAdDialog(): void {
    // Implémenter la logique d'ouverture du dialogue de création
  }

  editAd(ad: Advertisement): void {
    // Implémenter la logique d'édition
  }

  viewStats(ad: Advertisement): void {
    this.adService.getAdvertisementStats(ad.id!).subscribe(
      stats => {
        // Afficher les statistiques dans un dialogue
      }
    );
  }

  deleteAd(ad: Advertisement): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      this.adService.deleteAdvertisement(ad.id!).subscribe();
    }
  }

  private loadGlobalStats(): void {
    // Charger les statistiques globales
    this.globalStats = [
      { label: 'Total des vues', value: '10,234' },
      { label: 'Clics totaux', value: '1,234' },
      { label: 'Taux de conversion', value: '12.3%' },
      { label: 'Revenus', value: '5,678€' }
    ];
  }
}
