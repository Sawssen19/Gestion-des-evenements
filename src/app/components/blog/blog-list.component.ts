import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BlogFormDialogComponent } from './blog-form/blog-form-dialog.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-list',
  template: `
    <div class="blog-container" [@fadeIn]>
      <div class="blog-header">
        <h2>Blogs</h2>
        <div class="search-bar">
          <mat-form-field appearance="outline">
            <mat-label>Rechercher</mat-label>
            <input matInput [(ngModel)]="searchTerm" (keyup)="onSearch()">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateBlogDialog()">
          <mat-icon>add</mat-icon> Créer un nouveau blog
        </button>
      </div>

      <mat-tab-group (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Tous les blogs">
          <div class="blog-grid">
            <mat-card *ngFor="let blog of blogs" class="blog-card" [@fadeIn]>
              <mat-card-header>
                <mat-card-title>{{ blog.title }}</mat-card-title>
                <mat-card-subtitle>
                  <div class="blog-meta">
                    <span><mat-icon>person</mat-icon> {{ blog.author }}</span>
                    <span><mat-icon>access_time</mat-icon> {{ blog.createdAt | date }}</span>
                    <span><mat-icon>comment</mat-icon> {{ blog.commentsCount }}</span>
                  </div>
                </mat-card-subtitle>
              </mat-card-header>
              <img mat-card-image *ngIf="blog.imageUrl" [src]="blog.imageUrl" [alt]="blog.title">
              <mat-card-content>
                <p class="blog-preview">{{ blog.content | slice:0:200 }}...</p>
                <mat-chip-list>
                  <mat-chip *ngFor="let tag of blog.tags" color="accent" selected>{{ tag }}</mat-chip>
                </mat-chip-list>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button (click)="likeBlog(blog.id)" [color]="blog.isLiked ? 'accent' : ''">
                  <mat-icon>{{ blog.isLiked ? 'favorite' : 'favorite_border' }}</mat-icon>
                  {{ blog.likes }}
                </button>
                <button mat-button [routerLink]="['/blogs', blog.id]">
                  <mat-icon>read_more</mat-icon> Lire plus
                </button>
                <button mat-button (click)="openEditBlogDialog(blog)" *ngIf="isAdmin">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-button (click)="confirmDeleteBlog(blog.id)" *ngIf="isAdmin">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
          
          <mat-paginator
            [length]="totalBlogs"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
            aria-label="Sélectionner la page">
          </mat-paginator>
        </mat-tab>
        
        <mat-tab label="Populaires">
          <div class="blog-grid">
            <mat-card *ngFor="let blog of popularBlogs" class="blog-card" [@fadeIn]>
              <!-- Même contenu que ci-dessus -->
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .blog-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .blog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .search-bar {
      flex: 1;
      margin: 0 20px;
    }
    
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px 0;
    }
    
    .blog-card {
      transition: transform 0.2s;
    }
    
    .blog-card:hover {
      transform: translateY(-5px);
    }
    
    .blog-meta {
      display: flex;
      gap: 15px;
      color: #666;
    }
    
    .blog-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .blog-preview {
      margin: 15px 0;
      line-height: 1.6;
    }
    
    mat-chip-list {
      margin: 10px 0;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  popularBlogs: Blog[] = [];
  isAdmin = false;
  searchTerm = '';
  pageSize = 10;
  totalBlogs = 0;
  currentPage = 0;
  loading = false;
  error: string | null = null;

  constructor(
    private blogService: BlogService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
    this.loadPopularBlogs();
    this.checkAdminStatus();
  }

  private checkAdminStatus(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.roles?.includes('ADMIN') || false;
    });
  }

  loadBlogs(page: number = 0): void {
    this.loading = true;
    this.blogService.getBlogs(page, this.pageSize, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.blogs = response.blogs;
          this.totalBlogs = response.total;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des blogs';
          this.loading = false;
          console.error('Erreur:', error);
        }
      });
  }

  loadPopularBlogs(): void {
    this.blogService.getPopularBlogs().subscribe({
      next: (blogs) => {
        this.popularBlogs = blogs;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des blogs populaires:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadBlogs(0);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadBlogs(event.pageIndex);
  }

  onTabChange(event: any): void {
    if (event.index === 1 && !this.popularBlogs.length) {
      this.loadPopularBlogs();
    }
  }

  openCreateBlogDialog(): void {
    const dialogRef = this.dialog.open(BlogFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBlogs(this.currentPage);
      }
    });
  }

  openEditBlogDialog(blog: Blog): void {
    const dialogRef = this.dialog.open(BlogFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', blog }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBlogs(this.currentPage);
      }
    });
  }

  likeBlog(blogId: string): void {
    this.blogService.toggleLike(blogId).subscribe({
      next: (updatedBlog) => {
        this.blogs = this.blogs.map(blog => 
          blog.id === blogId ? { ...blog, likes: updatedBlog.likes, isLiked: updatedBlog.isLiked } : blog
        );
      },
      error: (error) => {
        console.error('Erreur lors du like:', error);
      }
    });
  }

  confirmDeleteBlog(blogId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce blog ?')) {
      this.blogService.deleteBlog(blogId).subscribe({
        next: () => {
          this.blogs = this.blogs.filter(blog => blog.id !== blogId);
          this.totalBlogs--;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
}
