import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Advertisement } from '../models/advertisement.model';

const STORAGE_KEY = 'advertisements';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  private adsSubject = new BehaviorSubject<Advertisement[]>([]);
  ads$ = this.adsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedAds = localStorage.getItem(STORAGE_KEY);
    if (storedAds) {
      const ads = JSON.parse(storedAds);
      ads.forEach((ad: Advertisement) => {
        ad.startDate = new Date(ad.startDate);
        ad.endDate = new Date(ad.endDate);
      });
      this.adsSubject.next(ads);
    } else {
      // Données par défaut
      const defaultAds: Advertisement[] = [
        {
          id: '1',
          title: 'Formation Angular Avancée',
          description: 'Devenez un expert Angular ! Formation en ligne avec certification.',
          imageUrl: 'https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G',
          linkUrl: 'https://example.com/angular-training',
          location: 'Homepage',
          type: 'banner',
          position: 'header',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'active',
          targetAudience: ['Developers', 'IT Professionals'],
          impressions: 1250,
          clicks: 85,
          engagement: 6.8,
          statistics: {
            views: 1500,
            clicks: 85,
            clickThroughRate: 5.67,
            revenue: 850
          }
        },
        {
          id: '2',
          title: 'Nouveau Framework JavaScript',
          description: 'Découvrez le dernier framework JavaScript qui révolutionne le développement web !',
          imageUrl: 'https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G',
          linkUrl: 'https://example.com/new-framework',
          location: 'Blog',
          type: 'sponsored',
          position: 'sidebar',
          startDate: new Date(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: 'active',
          targetAudience: ['Developers', 'Tech Enthusiasts'],
          impressions: 850,
          clicks: 42,
          engagement: 4.9,
          statistics: {
            views: 950,
            clicks: 42,
            clickThroughRate: 4.42,
            revenue: 420
          }
        },
        {
          id: '3',
          title: 'Conférence Tech 2025',
          description: 'La plus grande conférence tech de l\'année. Ne manquez pas cet événement !',
          imageUrl: 'https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G',
          linkUrl: 'https://example.com/tech-conference',
          location: 'All Pages',
          type: 'banner',
          position: 'footer',
          startDate: new Date(),
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: 'scheduled',
          targetAudience: ['IT Professionals', 'Tech Companies'],
          impressions: 2100,
          clicks: 168,
          engagement: 8.0,
          statistics: {
            views: 2500,
            clicks: 168,
            clickThroughRate: 6.72,
            revenue: 1680
          }
        },
        {
          id: '4',
          title: 'Offre Spéciale Cloud Services',
          description: 'Profitez de 50% de réduction sur nos services cloud premium pendant 3 mois !',
          imageUrl: 'https://www.filepicker.io/api/file/cloud-services-banner.jpg',
          linkUrl: 'https://example.com/cloud-offer',
          location: 'Services',
          type: 'banner',
          position: 'content',
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          status: 'active',
          targetAudience: ['Enterprise', 'Startups', 'Developers'],
          impressions: 3200,
          clicks: 245,
          engagement: 7.6,
          statistics: {
            views: 3500,
            clicks: 245,
            clickThroughRate: 7.0,
            revenue: 2450
          }
        }
      ];
      this.saveToStorage(defaultAds);
    }
  }

  private saveToStorage(ads: Advertisement[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    this.adsSubject.next(ads);
  }

  getAdvertisements(): Observable<Advertisement[]> {
    return this.ads$;
  }

  getAdvertisement(id: string): Observable<Advertisement | undefined> {
    return this.ads$.pipe(
      map(ads => ads.find(ad => ad.id === id))
    );
  }

  createAdvertisement(ad: Omit<Advertisement, 'id'>): Observable<Advertisement> {
    const newAd: Advertisement = {
      ...ad,
      id: Date.now().toString(),
      impressions: 0,
      clicks: 0,
      engagement: 0,
      statistics: {
        views: 0,
        clicks: 0,
        clickThroughRate: 0,
        revenue: 0
      }
    };

    const ads = [...this.adsSubject.value, newAd];
    this.saveToStorage(ads);
    return of(newAd);
  }

  updateAdvertisement(id: string, updates: Partial<Advertisement>): Observable<Advertisement> {
    const ads = this.adsSubject.value;
    const index = ads.findIndex(ad => ad.id === id);
    
    if (index === -1) {
      throw new Error('Advertisement not found');
    }

    const updatedAd = { ...ads[index], ...updates };
    const updatedAds = [...ads];
    updatedAds[index] = updatedAd;
    
    this.saveToStorage(updatedAds);
    return of(updatedAd);
  }

  deleteAdvertisement(id: string): Observable<void> {
    const ads = this.adsSubject.value.filter(ad => ad.id !== id);
    this.saveToStorage(ads);
    return of(void 0);
  }

  getAdvertisementsByPosition(position: string): Observable<Advertisement[]> {
    return this.ads$.pipe(
      map(ads => ads.filter(ad => ad.position === position))
    );
  }

  getAdvertisementsByType(type: string): Observable<Advertisement[]> {
    return this.ads$.pipe(
      map(ads => ads.filter(ad => ad.type === type))
    );
  }

  getAdvertisementsByLocation(location: string): Observable<Advertisement[]> {
    return this.ads$.pipe(
      map(ads => ads.filter(ad => ad.location === location))
    );
  }

  getAdvertisementStatistics(id: string): Observable<any> {
    return this.ads$.pipe(
      map(ads => {
        const ad = ads.find(a => a.id === id);
        return ad ? ad.statistics : null;
      })
    );
  }

  recordImpression(id: string): Observable<void> {
    const ads = this.adsSubject.value;
    const index = ads.findIndex(ad => ad.id === id);
    
    if (index === -1) {
      throw new Error('Advertisement not found');
    }

    const ad = ads[index];
    const impressions = (ad.impressions || 0) + 1;
    const views = (ad.statistics?.views || 0) + 1;
    const clicks = ad.statistics?.clicks || 0;
    const revenue = ad.statistics?.revenue || 0;
    
    const updatedAd: Advertisement = {
      ...ad,
      impressions,
      statistics: {
        views,
        clicks,
        revenue,
        clickThroughRate: impressions > 0 ? (clicks / impressions) * 100 : 0
      }
    };

    const updatedAds = [...ads];
    updatedAds[index] = updatedAd;
    
    this.saveToStorage(updatedAds);
    return of(void 0);
  }

  recordClick(id: string): Observable<void> {
    const ads = this.adsSubject.value;
    const index = ads.findIndex(ad => ad.id === id);
    
    if (index === -1) {
      throw new Error('Advertisement not found');
    }

    const ad = ads[index];
    const clicks = (ad.clicks || 0) + 1;
    const views = ad.statistics?.views || 0;
    const revenue = ad.statistics?.revenue || 0;
    
    const updatedAd: Advertisement = {
      ...ad,
      clicks,
      statistics: {
        views,
        clicks,
        revenue,
        clickThroughRate: ad.impressions ? (clicks / ad.impressions) * 100 : 0
      }
    };

    const updatedAds = [...ads];
    updatedAds[index] = updatedAd;
    
    this.saveToStorage(updatedAds);
    return of(void 0);
  }

  calculateEngagementRate(ad: Advertisement): number {
    const impressions = ad.impressions || 0;
    const clicks = ad.clicks || 0;
    return impressions > 0 ? (clicks / impressions) * 100 : 0;
  }
}
