import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

// Components
import { CommentDialogComponent } from './comment-dialog.component';

@NgModule({
  declarations: [
    CommentDialogComponent
  ],
  imports: [
    // Angular Core
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Material
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  exports: [
    CommentDialogComponent,
    
    // Re-export Material modules needed by parent components
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ]
})
export class CommentModule { }
