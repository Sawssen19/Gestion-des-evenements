import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './components/blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog/blog-detail/blog-detail.component';
import { AdManagementComponent } from './components/advertisement/ad-management/ad-management.component';
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'blogs', pathMatch: 'full' },
  { path: 'blogs', component: BlogListComponent },
  { path: 'blogs/create', component: BlogDetailComponent },
  { path: 'blogs/:id', component: BlogDetailComponent },
  {
    path: 'ads',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/advertisement/advertisement-list/advertisement-list.component')
            .then(m => m.AdvertisementListComponent)
      },
      {
        path: 'stats',
        loadComponent: () =>
          import('./components/advertisement/advertisement-stats/advertisement-stats.component')
            .then(m => m.AdvertisementStatsComponent)
      },
      {
        path: 'manage',
        component: AdManagementComponent
      }
    ]
  },
  { path: '**', redirectTo: 'blogs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
