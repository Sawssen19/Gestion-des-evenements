import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../models/blog.model';

@Component({
  selector: 'app-comment',
  template: `
    <mat-card class="comment-card">
      <mat-card-header>
        <div mat-card-avatar class="comment-avatar">
          <mat-icon>person</mat-icon>
        </div>
        <mat-card-subtitle>
          <div class="comment-meta">
            <span>{{ comment.author }}</span>
            <span>{{ comment.createdAt | date }}</span>
          </div>
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <p>{{ comment.content }}</p>
      </mat-card-content>

      <mat-card-actions>
        <button mat-icon-button (click)="onLike.emit(comment.id)">
          <mat-icon>thumb_up</mat-icon>
          <span>{{ comment.likes }}</span>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .comment-card {
      margin: 8px 0;
      background-color: #f8f9fa;
    }

    .comment-meta {
      display: flex;
      gap: 16px;
      color: rgba(0,0,0,0.6);
    }

    .comment-avatar {
      background-color: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    mat-card-content {
      margin: 16px 0;
      white-space: pre-wrap;
    }

    mat-card-actions {
      display: flex;
      align-items: center;
    }

    button span {
      margin-left: 4px;
    }
  `]
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Output() onLike = new EventEmitter<string>();
}
