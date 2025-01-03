import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule } from 'ngx-markdown';
import { BlogService } from '../../../services/blog.service';
import { BlogFormDialogComponent } from '../blog-form/blog-form-dialog.component';
import { Blog, Comment } from '../../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MarkdownModule
  ],
  template: `
    <div class="blog-detail-container" *ngIf="blog">
      <div class="header">
        <div class="header-content">
          <h1>{{ blog.title }}</h1>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="openEditDialog()" class="edit-button">
              <mat-icon>edit</mat-icon>
              Modifier l'article
            </button>
            <button mat-raised-button color="warn" (click)="deleteBlog()" class="delete-button">
              <mat-icon>delete</mat-icon>
              Supprimer l'article
            </button>
            <button mat-icon-button
                    [color]="blog.isFavorite ? 'warn' : ''"
                    (click)="toggleFavorite()"
                    [matTooltip]="blog.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'">
              <mat-icon>{{ blog.isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
            </button>
          </div>
          <div class="meta">
            <div class="author">
              <img [src]="blog.authorAvatar || 'assets/images/default-avatar.svg'"
                   [alt]="blog.author"
                   class="author-avatar"
                   (error)="handleAvatarError($event)">
              <span class="author-name">{{ blog.author }}</span>
            </div>
            <div class="post-info">
              <span class="date">{{ blog.createdAt | date:'longDate' }}</span>
              <span class="separator">·</span>
              <span class="reading-time">{{ getReadingTime() }} min de lecture</span>
            </div>
          </div>
        </div>
      </div>

      <mat-card class="blog-content">
        <img *ngIf="blog.imageUrl" 
             [src]="blog.imageUrl" 
             [alt]="blog.title"
             class="featured-image"
             (error)="handleImageError($event)">

        <div class="content-wrapper">
          <markdown [data]="blog.content"></markdown>

          <div class="tags" *ngIf="blog.tags?.length">
            <mat-chip-listbox aria-label="Tags">
              <mat-chip-option *ngFor="let tag of blog.tags" color="primary" selected>{{ tag }}</mat-chip-option>
            </mat-chip-listbox>
          </div>
        </div>
      </mat-card>

      <div class="comments-section">
        <h3>Commentaires ({{ blog.comments?.length || 0 }})</h3>

        <mat-form-field appearance="outline" class="comment-input">
          <mat-label>Ajouter un commentaire</mat-label>
          <textarea matInput
                    [(ngModel)]="newComment"
                    placeholder="Écrivez votre commentaire..."
                    rows="3"></textarea>
          <button mat-icon-button matSuffix (click)="addComment()" [disabled]="!newComment.trim()">
            <mat-icon>send</mat-icon>
          </button>
        </mat-form-field>

        <div class="comments-list">
          <div *ngFor="let comment of blog.comments" class="comment">
            <div class="comment-header">
              <img [src]="comment.authorAvatar || 'assets/images/default-avatar.svg'"
                   [alt]="comment.author"
                   class="comment-avatar"
                   (error)="handleAvatarError($event)">
              <div class="comment-info">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-date">{{ comment.createdAt | date:'medium' }}</span>
              </div>
            </div>

            <div class="comment-content" *ngIf="editingCommentId !== comment.id">
              {{ comment.content }}
            </div>

            <mat-form-field *ngIf="editingCommentId === comment.id" appearance="outline" class="edit-input">
              <textarea matInput
                        [(ngModel)]="editingCommentContent"
                        rows="3"></textarea>
              <div class="edit-actions">
                <button mat-button (click)="cancelEdit()">Annuler</button>
                <button mat-raised-button
                        color="primary"
                        (click)="saveCommentEdit(comment)"
                        [disabled]="!editingCommentContent.trim()">
                  Enregistrer
                </button>
              </div>
            </mat-form-field>

            <div class="comment-actions">
              <button mat-icon-button
                      [color]="comment.isLiked ? 'accent' : ''"
                      (click)="likeComment(comment)"
                      [matTooltip]="comment.isLiked ? 'Je n\\'aime plus' : 'J\\'aime'">
                <mat-icon>{{ comment.isLiked ? 'favorite' : 'favorite_border' }}</mat-icon>
                <span class="likes-count">{{ comment.likes }}</span>
              </button>
              <button mat-icon-button
                      (click)="replyToComment(comment)"
                      [color]="replyingToCommentId === comment.id ? 'primary' : ''"
                      matTooltip="Répondre">
                <mat-icon>forum</mat-icon>
              </button>
              <button mat-icon-button
                      (click)="editComment(comment)"
                      [color]="editingCommentId === comment.id ? 'primary' : ''"
                      matTooltip="Modifier">
                <mat-icon>mode_edit</mat-icon>
              </button>
              <button mat-icon-button
                      color="warn"
                      (click)="deleteComment(comment)"
                      matTooltip="Supprimer">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </div>

            <mat-form-field *ngIf="replyingToCommentId === comment.id"
                          appearance="outline"
                          class="reply-input">
              <mat-label>Votre réponse</mat-label>
              <textarea matInput
                        [(ngModel)]="replyContent"
                        rows="2"></textarea>
              <div class="reply-actions">
                <button mat-button (click)="cancelReply()">Annuler</button>
                <button mat-raised-button
                        color="primary"
                        (click)="submitReply(comment)"
                        [disabled]="!replyContent.trim()">
                  Répondre
                </button>
              </div>
            </mat-form-field>

            <div class="replies" *ngIf="comment.replies?.length">
              <div *ngFor="let reply of comment.replies" class="reply">
                <div class="reply-header">
                  <img [src]="reply.authorAvatar || 'assets/images/default-avatar.svg'"
                       [alt]="reply.author"
                       class="reply-avatar"
                       (error)="handleAvatarError($event)">
                  <div class="reply-info">
                    <span class="reply-author">{{ reply.author }}</span>
                    <span class="reply-date">{{ reply.createdAt | date:'medium' }}</span>
                  </div>
                </div>
                <div class="reply-content">{{ reply.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blog-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      margin-bottom: 2rem;
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #333;
      }
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      align-items: center;

      .edit-button, .delete-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .delete-button {
        background-color: #dc3545;
        color: white;

        &:hover {
          background-color: #c82333;
        }
      }
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    .author {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .post-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .separator {
      margin: 0 4px;
    }

    .blog-content {
      margin-bottom: 32px;
      padding: 24px;
    }

    .featured-image {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      margin-bottom: 24px;
      border-radius: 4px;
    }

    .content-wrapper {
      font-size: 1.1em;
      line-height: 1.6;
    }

    .comments-section {
      margin-top: 32px;
    }

    .comment-input {
      width: 100%;
      margin-bottom: 24px;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .comment {
      padding: 16px;
      border-radius: 8px;
      background-color: #f5f5f5;
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .comment-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .comment-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .comment-author {
      font-weight: 500;
    }

    .comment-date {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.6);
    }

    .comment-content {
      margin-bottom: 12px;
      white-space: pre-wrap;
    }

    .comment-actions {
      display: flex;
      gap: 8px;
    }

    .likes-count {
      font-size: 0.9em;
      margin-left: 4px;
    }

    .edit-input {
      width: 100%;
      margin: 12px 0;
    }

    .edit-actions, .reply-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .reply-input {
      width: 100%;
      margin: 12px 0;
    }

    .replies {
      margin-left: 40px;
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .reply {
      padding: 12px;
      border-radius: 8px;
      background-color: #ffffff;
    }

    .reply-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .reply-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    .reply-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .reply-author {
      font-weight: 500;
      font-size: 0.9em;
    }

    .reply-date {
      font-size: 0.8em;
      color: rgba(0, 0, 0, 0.6);
    }

    .reply-content {
      font-size: 0.95em;
      white-space: pre-wrap;
    }

    .tags {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    ::ng-deep .tags .mdc-evolution-chip-set__chips {
      gap: 8px;
    }

    ::ng-deep .tags .mat-mdc-chip-option {
      --mdc-chip-elevated-container-color: #f5f5f5;
      --mdc-chip-label-text-color: rgba(0, 0, 0, 0.87);
    }

    ::ng-deep .tags .mat-mdc-chip-option.mat-mdc-chip-selected {
      --mdc-chip-elevated-container-color: #e0e0e0;
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  loading = true;
  newComment = '';
  editingCommentId: string | null = null;
  editingCommentContent = '';
  replyingToCommentId: string | null = null;
  replyContent = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadBlog();
      }
    });
  }

  loadBlog(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/blogs']);
      return;
    }

    this.blogService.getBlogById(id).subscribe({
      next: (blog: Blog | undefined) => {
        if (blog) {
          this.blog = blog;
        } else {
          this.router.navigate(['/blogs']);
        }
      },
      error: (error: Error) => {
        console.error('Error loading blog:', error);
        this.snackBar.open('Erreur lors du chargement de l\'article', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/blogs']);
      }
    });
  }

  openEditDialog(): void {
    if (!this.blog) return;

    const dialogRef = this.dialog.open(BlogFormDialogComponent, {
      width: '800px',
      data: { ...this.blog }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.blog) {
        const updatedBlog: Blog = {
          ...this.blog,
          ...result,
          id: this.blog.id,
          comments: this.blog.comments,
          likes: this.blog.likes,
          views: this.blog.views,
          isLiked: this.blog.isLiked
        };

        this.blogService.updateBlog(updatedBlog).subscribe({
          next: (blog) => {
            this.blog = blog;
            this.snackBar.open('Article mis à jour avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  addComment(): void {
    if (!this.blog || !this.newComment.trim()) return;

    const comment: Partial<Comment> = {
      content: this.newComment.trim(),
      author: 'Anonymous',
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    this.blogService.addComment(this.blog.id, comment).subscribe({
      next: (updatedBlog) => {
        this.blog = updatedBlog;
        this.newComment = '';
        this.snackBar.open('Commentaire ajouté', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.snackBar.open('Erreur lors de l\'ajout du commentaire', 'Fermer', { duration: 3000 });
      }
    });
  }

  likeComment(comment: Comment): void {
    if (!this.blog) return;

    const updatedComment: Comment = {
      ...comment,
      likes: comment.likes + 1,
      isLiked: true
    };

    const updatedBlog: Blog = {
      ...this.blog,
      comments: this.blog.comments.map(c => 
        c.id === comment.id ? updatedComment : c
      )
    };

    this.blogService.updateBlog(updatedBlog).subscribe({
      next: (blog) => {
        this.blog = blog;
      },
      error: (error) => {
        console.error('Error liking comment:', error);
        this.snackBar.open('Erreur lors du like du commentaire', 'Fermer', { duration: 3000 });
      }
    });
  }

  replyToComment(comment: Comment): void {
    if (!this.blog) return;
    this.replyingToCommentId = comment.id;
    this.replyContent = '';
  }

  submitReply(comment: Comment): void {
    if (!this.blog || !this.replyContent.trim()) return;

    const newReply: Comment = {
      id: crypto.randomUUID(),
      content: this.replyContent.trim(),
      author: 'Anonymous',
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    const updatedComment: Comment = {
      ...comment,
      replies: [...(comment.replies || []), newReply]
    };

    const updatedBlog: Blog = {
      ...this.blog,
      comments: this.blog.comments.map(c => 
        c.id === comment.id ? updatedComment : c
      )
    };

    this.blogService.updateBlog(updatedBlog).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.replyingToCommentId = null;
        this.replyContent = '';
        this.snackBar.open('Réponse ajoutée', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error adding reply:', error);
        this.snackBar.open('Erreur lors de l\'ajout de la réponse', 'Fermer', { duration: 3000 });
      }
    });
  }

  editComment(comment: Comment): void {
    this.editingCommentId = comment.id;
    this.editingCommentContent = comment.content;
  }

  saveCommentEdit(comment: Comment): void {
    if (!this.blog || !this.editingCommentContent.trim()) return;

    const updatedComment: Comment = {
      ...comment,
      content: this.editingCommentContent.trim(),
      updatedAt: new Date().toISOString()
    };

    const updatedBlog: Blog = {
      ...this.blog,
      comments: this.blog.comments.map(c => 
        c.id === comment.id ? updatedComment : c
      )
    };

    this.blogService.updateBlog(updatedBlog).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.editingCommentId = null;
        this.editingCommentContent = '';
        this.snackBar.open('Commentaire mis à jour', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating comment:', error);
        this.snackBar.open('Erreur lors de la mise à jour du commentaire', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteComment(comment: Comment): void {
    if (!this.blog) return;

    const updatedBlog: Blog = {
      ...this.blog,
      comments: this.blog.comments.filter(c => c.id !== comment.id)
    };

    this.blogService.updateBlog(updatedBlog).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.snackBar.open('Commentaire supprimé', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
        this.snackBar.open('Erreur lors de la suppression du commentaire', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteBlog(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      if (this.blog?.id) {
        this.blogService.deleteBlog(this.blog.id).subscribe({
          next: () => {
            this.snackBar.open('Article supprimé avec succès', 'Fermer', { duration: 3000 });
            this.router.navigate(['/blogs']);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression de l\'article:', error);
            this.snackBar.open('Erreur lors de la suppression de l\'article', 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/default-blog.jpg';
  }

  handleAvatarError(event: any) {
    event.target.src = 'assets/images/default-avatar.svg';
  }

  getReadingTime(): number {
    if (!this.blog?.content) return 0;
    const wordsPerMinute = 200;
    const words = this.blog.content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editingCommentContent = '';
  }

  cancelReply() {
    this.replyingToCommentId = null;
    this.replyContent = '';
  }

  toggleFavorite(): void {
    if (!this.blog) return;

    const updatedBlog: Blog = {
      ...this.blog,
      isFavorite: !this.blog.isFavorite
    };

    this.blogService.updateBlog(updatedBlog).subscribe({
      next: (blog) => {
        this.blog = blog;
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        this.snackBar.open('Erreur lors de la mise à jour des favoris', 'Fermer', { duration: 3000 });
      }
    });
  }
}
