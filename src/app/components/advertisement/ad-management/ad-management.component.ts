import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-ad-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe
  ],
  template: `
    <div class="container mt-4">
      <h2>Advertisement Management</h2>
      
      <!-- Ad Creation Form -->
      <div class="card mb-4">
        <div class="card-body">
          <h4>Create New Advertisement</h4>
          <form [formGroup]="adForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Title</label>
                <input type="text" class="form-control" formControlName="title">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Type</label>
                <select class="form-control" formControlName="type">
                  <option value="banner">Banner</option>
                  <option value="video">Video</option>
                  <option value="sponsored">Sponsored</option>
                </select>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" formControlName="description" rows="3"></textarea>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control" formControlName="startDate">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">End Date</label>
                <input type="date" class="form-control" formControlName="endDate">
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Image URL</label>
                <input type="text" class="form-control" formControlName="imageUrl">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Link URL</label>
                <input type="text" class="form-control" formControlName="linkUrl">
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Placement</label>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="home" (change)="onPlacementChange($event)">
                <label class="form-check-label">Home Page</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="blogs" (change)="onPlacementChange($event)">
                <label class="form-check-label">Blogs</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="events" (change)="onPlacementChange($event)">
                <label class="form-check-label">Events</label>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary" [disabled]="!adForm.valid">Create Advertisement</button>
          </form>
        </div>
      </div>
      
      <!-- Active Advertisements -->
      <div class="card">
        <div class="card-body">
          <h4>Active Advertisements</h4>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ad of advertisements">
                  <td>{{ ad.title }}</td>
                  <td>{{ ad.type }}</td>
                  <td>{{ ad.startDate | date }} - {{ ad.endDate | date }}</td>
                  <td>{{ ad.statistics?.views || 0 }}</td>
                  <td>{{ ad.statistics?.clicks || 0 }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning me-2" (click)="editAd(ad)">Edit</button>
                    <button class="btn btn-sm btn-danger" (click)="deleteAd(ad.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class AdManagementComponent implements OnInit {
  adForm: FormGroup;
  advertisements: Advertisement[] = [];
  selectedPlacements: string[] = [];
  selectedAd: Advertisement | null = null;

  constructor(
    private fb: FormBuilder,
    private adService: AdvertisementService
  ) {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['banner', Validators.required],
      imageUrl: ['', Validators.required],
      linkUrl: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: [''],
      position: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.loadAdvertisements();
  }

  loadAdvertisements(): void {
    this.adService.ads$.subscribe(ads => {
      this.advertisements = ads;
    });
  }

  onPlacementChange(event: any): void {
    if (event.target.checked) {
      this.selectedPlacements.push(event.target.value);
    } else {
      this.selectedPlacements = this.selectedPlacements.filter(p => p !== event.target.value);
    }
  }

  onSubmit(): void {
    if (this.adForm.valid) {
      const newAd: Advertisement = {
        ...this.adForm.value,
        placement: {
          position: 'main',
          pages: this.selectedPlacements
        },
        status: 'active',
        statistics: {
          views: 0,
          clicks: 0,
          ctr: 0,
          revenue: 0
        }
      };

      this.adService.createAdvertisement(newAd).subscribe({
        next: () => {
          this.adForm.reset();
          this.selectedPlacements = [];
          this.loadAdvertisements();
        },
        error: (error) => console.error('Error creating advertisement:', error)
      });
    }
  }

  editAd(ad: Advertisement): void {
    this.selectedAd = ad;
    this.adForm.patchValue({
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl || '',
      linkUrl: ad.linkUrl,
      startDate: ad.startDate,
      endDate: ad.endDate,
      location: ad.location || '',
      type: ad.type,
      position: ad.position,
      status: ad.status
    });
    this.selectedPlacements = ad.location ? [ad.location] : [];
  }

  deleteAd(id: string | undefined): void {
    if (id) {
      this.adService.deleteAdvertisement(id).subscribe({
        next: () => this.loadAdvertisements(),
        error: (error) => console.error('Error deleting advertisement:', error)
      });
    }
  }
}
