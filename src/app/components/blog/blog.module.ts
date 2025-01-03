import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

// Feature Modules
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogFormDialogComponent } from './blog-form-dialog/blog-form-dialog.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    BlogListComponent,
    BlogDetailComponent,
    BlogFormDialogComponent
  ],
  imports: [
    // Angular Core
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Feature Modules
    BlogRoutingModule,
    SharedModule,
    
    // Third Party
    MarkdownModule.forChild(),
    
    // Material
    ...materialModules
  ],
  exports: [
    BlogListComponent,
    BlogDetailComponent,
    BlogFormDialogComponent
  ]
})
export class BlogModule { }
