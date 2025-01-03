import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './components/blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog/blog-detail/blog-detail.component';
import { AdManagementComponent } from './components/advertisement/ad-management/ad-management.component';
import { AdStatisticsComponent } from './components/advertisement/ad-statistics/ad-statistics.component';
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'blogs', pathMatch: 'full' },
  { path: 'blogs', component: BlogListComponent },
  { path: 'blogs/create', component: BlogDetailComponent },
  { path: 'blogs/:id', component: BlogDetailComponent },
  { path: 'ads', component: AdvertisementListComponent },
  { path: 'ads/manage', component: AdManagementComponent },
  { path: 'ads/stats', component: AdStatisticsComponent },
  { path: '**', redirectTo: 'blogs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
