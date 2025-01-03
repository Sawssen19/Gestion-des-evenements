import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog, Comment } from '../../models/blog.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-detail',
  template: `
    <div class="blog-detail-container" *ngIf="blog">
      <mat-card class="blog-content">
        <mat-card-header>
          <mat-card-title>{{ blog.title }}</mat-card-title>
          <mat-card-subtitle>
            Par {{ blog.author }} | {{ blog.createdAt | date }}
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div [innerHTML]="blog.content"></div>
          
          <mat-chip-list>
            <mat-chip *ngFor="let tag of blog.tags">{{ tag }}</mat-chip>
          </mat-chip-list>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button (click)="likeBlog()">
            <mat-icon>thumb_up</mat-icon> {{ blog.likes }}
          </button>
        </mat-card-actions>
      </mat-card>

      <div class="comments-section">
        <h3>Commentaires</h3>
        
        <mat-card class="comment-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Ajouter un commentaire</mat-label>
            <textarea matInput [(ngModel)]="newComment" rows="3"></textarea>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="addComment()">
            Publier
          </button>
        </mat-card>

        <div class="comments-list">
          <mat-card *ngFor="let comment of blog.comments" class="comment">
            <mat-card-header>
              <mat-card-subtitle>
                {{ comment.author }} | {{ comment.createdAt | date }}
              </mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>{{ comment.content }}</p>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button (click)="likeComment(comment.id)">
                <mat-icon>thumb_up</mat-icon> {{ comment.likes }}
              </button>
              <button mat-button (click)="moderateComment(comment.id)" *ngIf="isAdmin">
                {{ comment.isModerated ? 'Approuver' : 'Modérer' }}
              </button>
              <button mat-button (click)="deleteComment(comment.id)" *ngIf="isAdmin">
                Supprimer
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blog-detail-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 0 20px;
    }
    .blog-content {
      margin-bottom: 30px;
    }
    .comments-section {
      margin-top: 30px;
    }
    .comment-form {
      margin-bottom: 20px;
    }
    .full-width {
      width: 100%;
    }
    .comment {
      margin-bottom: 15px;
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  newComment: string = '';
  isAdmin = false; // À implémenter avec votre système d'authentification

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.blogService.getBlog(blogId).subscribe(
        blog => this.blog = blog
      );
    }
  }

  likeBlog(): void {
    if (this.blog?.id) {
      this.blogService.likeBlog(this.blog.id).subscribe(
        updatedBlog => this.blog = updatedBlog
      );
    }
  }

  addComment(): void {
    if (this.blog?.id && this.newComment.trim()) {
      const comment: Comment = {
        content: this.newComment,
        author: 'Utilisateur actuel', // À remplacer par l'utilisateur authentifié
        createdAt: new Date(),
        likes: 0,
        isModerated: false
      };

      this.blogService.addComment(this.blog.id, comment).subscribe(
        newComment => {
          this.blog?.comments.unshift(newComment);
          this.newComment = '';
        }
      );
    }
  }

  likeComment(commentId: string | undefined): void {
    if (this.blog?.id && commentId) {
      this.blogService.likeComment(this.blog.id, commentId).subscribe();
    }
  }

  moderateComment(commentId: string | undefined): void {
    if (this.blog?.id && commentId) {
      const comment = this.blog.comments.find(c => c.id === commentId);
      if (comment) {
        this.blogService.moderateComment(this.blog.id, commentId, !comment.isModerated)
          .subscribe();
      }
    }
  }

  deleteComment(commentId: string | undefined): void {
    if (this.blog?.id && commentId && confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.blogService.deleteComment(this.blog.id, commentId).subscribe(
        () => {
          if (this.blog) {
            this.blog.comments = this.blog.comments.filter(c => c.id !== commentId);
          }
        }
      );
    }
  }
}
