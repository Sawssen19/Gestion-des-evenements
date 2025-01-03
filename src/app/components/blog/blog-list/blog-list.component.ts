import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { Blog } from '../../../models/blog.model';
import { BlogService } from '../../../services/blog.service';
import { BlogFormDialogComponent } from '../blog-form/blog-form-dialog.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    MatChipsModule
  ],
  template: `
    <div class="blog-container">
      <div class="sidebar">
        <div class="sidebar-header">
          <h1>Blog</h1>
          <p class="subtitle">Explorez nos articles</p>
        </div>
        
        <div class="sidebar-nav">
          <a [class.active]="activeTabIndex === 0" (click)="onTabChange({index: 0})">
            <mat-icon>article</mat-icon>
            <span>Articles</span>
            <span class="count">{{ filteredBlogs.length }}</span>
          </a>
          <a [class.active]="activeTabIndex === 1" (click)="onTabChange({index: 1})">
            <mat-icon>bookmark</mat-icon>
            <span>Favoris</span>
            <span class="count">{{ favoriteBlogs.length }}</span>
          </a>
        </div>

        <div class="sidebar-search">
          <mat-form-field appearance="outline">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput
                   [(ngModel)]="searchQuery"
                   (ngModelChange)="onSearch()"
                   placeholder="Rechercher...">
          </mat-form-field>
        </div>

        <button mat-flat-button class="create-button" (click)="createNewBlog()">
          <mat-icon>add</mat-icon>
          <span>Nouvel article</span>
        </button>
      </div>

      <div class="main-content">
        <div class="content-header">
          <h2>{{ activeTabIndex === 0 ? 'Tous les articles' : 'Articles favoris' }}</h2>
          <div class="view-options">
            <button mat-icon-button>
              <mat-icon>view_module</mat-icon>
            </button>
            <button mat-icon-button>
              <mat-icon>view_list</mat-icon>
            </button>
          </div>
        </div>

        <div class="blog-grid" [class.list-view]="false">
          <mat-card *ngFor="let blog of activeTabIndex === 0 ? filteredBlogs : favoriteBlogs" 
                    class="blog-card">
            <div class="card-media" [routerLink]="['/blogs', blog.id]" style="cursor: pointer;">
              <img [src]="blog.imageUrl || 'assets/images/default-blog.jpg'"
                   [alt]="blog.title"
                   (error)="handleImageError($event)">
              <div class="card-overlay">
                <span>Lire l'article</span>
              </div>
            </div>

            <mat-card-content>
              <div class="card-meta">
                <div class="author">
                  <img [src]="blog.authorAvatar || 'assets/images/default-avatar.svg'"
                       [alt]="blog.author"
                       (error)="handleAvatarError($event)">
                  <span>{{ blog.author }}</span>
                </div>
                <span class="date">{{ blog.createdAt | date:'dd MMM yyyy' }}</span>
              </div>

              <h3 class="card-title" [routerLink]="['/blogs', blog.id]" style="cursor: pointer;">
                {{ blog.title }}
              </h3>

              <p class="card-excerpt">
                {{ blog.content | slice:0:120 }}...
              </p>

              <div class="card-tags" *ngIf="blog.tags?.length">
                <span *ngFor="let tag of blog.tags" 
                      class="tag"
                      (click)="filterByTag(tag, $event)">
                  #{{ tag }}
                </span>
              </div>

              <div class="card-actions">
                <div class="stats">
                  <button mat-icon-button [class.active]="blog.isLiked"
                          (click)="toggleLike(blog, $event)">
                    <mat-icon>{{ blog.isLiked ? 'favorite' : 'favorite_border' }}</mat-icon>
                    <span>{{ blog.likes }}</span>
                  </button>
                  <button mat-icon-button>
                    <mat-icon>chat_bubble_outline</mat-icon>
                    <span>{{ blog.comments?.length || 0 }}</span>
                  </button>
                  <button mat-icon-button>
                    <mat-icon>visibility</mat-icon>
                    <span>{{ blog.views }}</span>
                  </button>
                </div>
                <button mat-icon-button class="bookmark-btn"
                        [class.active]="blog.isFavorite"
                        (click)="toggleBookmark(blog, $event)">
                  <mat-icon>{{ blog.isFavorite ? 'bookmark' : 'bookmark_border' }}</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <div *ngIf="activeTabIndex === 1 && favoriteBlogs.length === 0" 
               class="empty-state">
            <mat-icon>bookmark_border</mat-icon>
            <h3>Aucun favori</h3>
            <p>Marquez des articles comme favoris pour les retrouver ici</p>
            <button mat-flat-button color="primary" (click)="activeTabIndex = 0">
              Découvrir les articles
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blog-container {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
      background: #f8f9fa;
    }

    .sidebar {
      background: white;
      padding: 2rem;
      border-right: 1px solid #edf2f7;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-header {
      margin-bottom: 2rem;

      h1 {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0;
        color: #2d3748;
      }

      .subtitle {
        color: #718096;
        margin: 0.5rem 0 0;
        font-size: 0.875rem;
      }
    }

    .sidebar-nav {
      margin-bottom: 2rem;

      a {
        display: flex;
        align-items: center;
        padding: 0.875rem 1rem;
        color: #4a5568;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 0.5rem;

        &:hover {
          background: #f7fafc;
        }

        &.active {
          background: #ebf4ff;
          color: #3182ce;

          .count {
            background: #3182ce;
            color: white;
          }
        }

        mat-icon {
          margin-right: 1rem;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        span {
          font-size: 0.9375rem;
        }

        .count {
          margin-left: auto;
          background: #edf2f7;
          padding: 0.25rem 0.625rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      }
    }

    .sidebar-search {
      margin-bottom: 2rem;

      mat-form-field {
        width: 100%;
      }

      ::ng-deep .mat-mdc-form-field-flex {
        background: #f7fafc;
        border-radius: 0.5rem;
        padding: 0 1rem !important;
      }

      input {
        font-size: 0.9375rem;
      }
    }

    .create-button {
      width: 100%;
      background: #3182ce;
      color: white;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
        background: #2c5282;
      }

      mat-icon {
        margin-right: 0.5rem;
      }
    }

    .main-content {
      padding: 2rem;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2d3748;
        margin: 0;
      }

      .view-options {
        display: flex;
        gap: 0.5rem;

        button {
          color: #718096;

          &:hover {
            color: #4a5568;
            background: #edf2f7;
          }
        }
      }
    }

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;

      &.list-view {
        grid-template-columns: 1fr;
      }
    }

    .blog-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.1);

        .card-media img {
          transform: scale(1.05);
        }
      }
    }

    .card-media {
      position: relative;
      padding-top: 60%;
      cursor: pointer;
      overflow: hidden;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .card-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;

        span {
          color: white;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border: 2px solid white;
          border-radius: 0.25rem;
        }
      }

      &:hover .card-overlay {
        opacity: 1;
      }
    }

    mat-card-content {
      padding: 1.5rem !important;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      .author {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          object-fit: cover;
        }

        span {
          font-size: 0.875rem;
          color: #4a5568;
          font-weight: 500;
        }
      }

      .date {
        font-size: 0.75rem;
        color: #718096;
      }
    }

    .card-title {
      margin: 0 0 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #2d3748;
      cursor: pointer;
      line-height: 1.4;

      &:hover {
        color: #3182ce;
      }
    }

    .card-excerpt {
      font-size: 0.875rem;
      color: #718096;
      line-height: 1.6;
      margin: 0 0 1rem;
    }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .tag {
        font-size: 0.75rem;
        color: #3182ce;
        background: #ebf8ff;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #bee3f8;
        }
      }
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #edf2f7;

      .stats {
        display: flex;
        gap: 0.5rem;

        button {
          color: #718096;

          &.active {
            color: #e53e3e;
          }

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }

          span {
            font-size: 0.75rem;
            margin-left: 0.25rem;
          }
        }
      }

      .bookmark-btn {
        color: #718096;

        &.active {
          color: #3182ce;
        }
      }
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1rem;

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #cbd5e0;
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #2d3748;
        margin: 0 0 0.5rem;
      }

      p {
        color: #718096;
        margin: 0 0 1.5rem;
      }

      button {
        background: #3182ce;
        color: white;
        padding: 0 2rem;
      }
    }

    @media (max-width: 1024px) {
      .blog-container {
        grid-template-columns: 240px 1fr;
      }
    }

    @media (max-width: 768px) {
      .blog-container {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: fixed;
        left: -280px;
        z-index: 1000;
        transition: left 0.3s ease;

        &.open {
          left: 0;
        }
      }

      .main-content {
        padding: 1rem;
      }

      .blog-grid {
        gap: 1rem;
      }
    }
  `],
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  favoriteBlogs: Blog[] = [];
  searchQuery: string = '';
  activeTabIndex: number = 0;
  selectedTags: string[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.updateFilteredBlogs();
        this.updateFavoriteBlogs();
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.snackBar.open('Erreur lors du chargement des articles', 'Fermer', { duration: 3000 });
      }
    });
  }

  updateFilteredBlogs(): void {
    let filtered = [...this.blogs];
    
    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(search) ||
        blog.content.toLowerCase().includes(search) ||
        blog.author.toLowerCase().includes(search) ||
        (blog.tags || []).some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(blog =>
        this.selectedTags.every(tag => (blog.tags || []).includes(tag))
      );
    }

    this.filteredBlogs = filtered;
  }

  updateFavoriteBlogs(): void {
    this.favoriteBlogs = this.blogs.filter(blog => blog.isFavorite);
  }

  onSearch(): void {
    this.updateFilteredBlogs();
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
    if (this.activeTabIndex === 1) {
      this.updateFavoriteBlogs();
    }
  }

  filterByTag(tag: string, event: Event): void {
    event.stopPropagation();
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.updateFilteredBlogs();
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags.includes(tag);
  }

  navigateToBlog(blog: Blog): void {
    this.router.navigate(['/blogs', blog.id]);
  }

  toggleBookmark(blog: Blog, event: Event): void {
    event.stopPropagation();
    
    const updatedBlog = {
      ...blog,
      isFavorite: !blog.isFavorite
    };

    this.blogService.updateBlog(updatedBlog).subscribe({
      next: (updated) => {
        const index = this.blogs.findIndex(b => b.id === updated.id);
        if (index !== -1) {
          this.blogs[index] = updated;
          this.updateFilteredBlogs();
          this.updateFavoriteBlogs();
        }
        
        const action = updated.isFavorite ? 'ajouté aux' : 'retiré des';
        this.snackBar.open(`Article ${action} favoris`, 'Fermer', { duration: 2000 });
      },
      error: (error: Error) => {
        console.error('Error toggling favorite:', error);
        this.snackBar.open('Erreur lors de la mise à jour des favoris', 'Fermer', { duration: 3000 });
      }
    });
  }

  toggleLike(blog: Blog, event: Event): void {
    event.stopPropagation();
    this.blogService.toggleLike(blog.id).subscribe({
      next: (updated) => {
        const index = this.blogs.findIndex(b => b.id === updated.id);
        if (index !== -1) {
          this.blogs[index] = updated;
          this.updateFilteredBlogs();
          this.updateFavoriteBlogs();
        }
      },
      error: (error: Error) => {
        console.error('Error toggling like:', error);
        this.snackBar.open('Erreur lors de la mise à jour du like', 'Fermer', { duration: 3000 });
      }
    });
  }

  getLikeTooltip(isLiked: boolean): string {
    return isLiked ? 'Retirer le like' : 'Aimer cet article';
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/default-blog.jpg';
  }

  handleAvatarError(event: any): void {
    event.target.src = 'assets/images/default-avatar.svg';
  }

  createNewBlog(): void {
    const dialogRef = this.dialog.open(BlogFormDialogComponent, {
      width: '800px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.blogService.createBlog(result).subscribe({
          next: (newBlog) => {
            this.blogs.unshift(newBlog);
            this.updateFilteredBlogs();
            this.snackBar.open('Article créé avec succès', 'Fermer', { duration: 3000 });
          },
          error: (error) => {
            console.error('Erreur lors de la création de l\'article:', error);
            this.snackBar.open('Erreur lors de la création de l\'article', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }
}
