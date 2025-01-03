import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AdvertisementListComponent } from './advertisement-list/advertisement-list.component';
import { AdvertisementFormDialogComponent } from './advertisement-form/advertisement-form-dialog.component';
import { AdvertisementManagementComponent } from './advertisement-management/advertisement-management.component';
import { AdvertisementStatisticsComponent } from './advertisement-statistics/advertisement-statistics.component';

@NgModule({
  declarations: [
    AdvertisementListComponent,
    AdvertisementFormDialogComponent,
    AdvertisementManagementComponent,
    AdvertisementStatisticsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule
  ],
  exports: [
    AdvertisementListComponent,
    AdvertisementFormDialogComponent,
    AdvertisementManagementComponent,
    AdvertisementStatisticsComponent
  ]
})
export class AdsModule { }
