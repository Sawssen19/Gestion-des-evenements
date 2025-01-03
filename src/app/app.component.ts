import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="toolbar">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="title">Blog & Pub</span>
        <div class="toolbar-spacer"></div>
        <button mat-button routerLink="/blogs">
          <mat-icon>article</mat-icon>
          Articles
        </button>
        <button mat-button routerLink="/ads">
          <mat-icon>campaign</mat-icon>
          Publicités
        </button>
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Profil</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Paramètres</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Déconnexion</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" class="sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="/blogs" routerLinkActive="active">
              <mat-icon matListItemIcon>article</mat-icon>
              <span matListItemTitle>Articles</span>
            </a>
            <a mat-list-item routerLink="/ads" routerLinkActive="active">
              <mat-icon matListItemIcon>campaign</mat-icon>
              <span matListItemTitle>Publicités</span>
            </a>
            <mat-divider></mat-divider>
            <a mat-list-item routerLink="/ads/stats" routerLinkActive="active">
              <mat-icon matListItemIcon>analytics</mat-icon>
              <span matListItemTitle>Statistiques</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    .sidenav {
      width: 250px;
      background: #fafafa;
      border-right: 1px solid rgba(0,0,0,0.12);
    }

    .content {
      padding: 20px;
      background: #f5f5f5;
    }

    mat-nav-list {
      padding-top: 0;
    }

    .active {
      background: rgba(63, 81, 181, 0.1);
      border-left: 4px solid #3f51b5;
    }

    mat-toolbar button {
      margin-left: 8px;
    }

    mat-toolbar button mat-icon {
      margin-right: 4px;
    }

    @media (max-width: 600px) {
      .toolbar button span {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private router: Router) {}

  logout() {
    // Implémentation de la déconnexion
    console.log('Déconnexion...');
  }
}
