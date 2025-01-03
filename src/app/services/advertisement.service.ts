import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay, tap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Advertisement, AdvertisementStatus, AdvertisementType, CreateAdvertisementDTO } from '../models/advertisement.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  private readonly STORAGE_KEY = 'advertisements';
  private adsSubject = new BehaviorSubject<Advertisement[]>([]);
  advertisements$ = this.adsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedAds = localStorage.getItem(this.STORAGE_KEY);
    if (storedAds) {
      const ads = JSON.parse(storedAds);
      // Convertir les dates string en objets Date
      ads.forEach((ad: Advertisement) => {
        ad.startDate = new Date(ad.startDate);
        ad.endDate = new Date(ad.endDate);
      });
      this.adsSubject.next(ads);
    }
  }

  private saveToStorage(ads: Advertisement[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ads));
  }

  getAdvertisements(): Observable<Advertisement[]> {
    this.loadFromStorage();
    return this.advertisements$;
  }

  createAdvertisement(advertisement: CreateAdvertisementDTO): Observable<Advertisement> {
    const newAd: Advertisement = {
      ...advertisement,
      id: Date.now().toString(),
      status: advertisement.status || 'paused',
      statistics: {
        views: 0,
        clicks: 0,
        clickThroughRate: 0,
        revenue: 0
      }
    };

    const currentAds = this.adsSubject.value;
    const updatedAds = [...currentAds, newAd];
    this.adsSubject.next(updatedAds);
    this.saveToStorage(updatedAds);

    return of(newAd).pipe(delay(500));
  }

  updateAdvertisement(advertisement: Partial<Advertisement> & { id: string }): Observable<Advertisement> {
    const currentAds = this.adsSubject.value;
    const index = currentAds.findIndex(ad => ad.id === advertisement.id);
    
    if (index === -1) {
      return throwError(() => new Error('Advertisement not found'));
    }

    const updatedAd = { ...currentAds[index], ...advertisement };
    const updatedAds = [...currentAds];
    updatedAds[index] = updatedAd;
    
    this.adsSubject.next(updatedAds);
    this.saveToStorage(updatedAds);

    return of(updatedAd).pipe(delay(500));
  }

  deleteAdvertisement(id: string): Observable<void> {
    const currentAds = this.adsSubject.value;
    const updatedAds = currentAds.filter(ad => ad.id !== id);
    
    this.adsSubject.next(updatedAds);
    this.saveToStorage(updatedAds);

    return of(void 0).pipe(delay(500));
  }

  getAdvertisementById(id: string): Observable<Advertisement | undefined> {
    return this.advertisements$.pipe(
      map(ads => ads.find(ad => ad.id === id))
    );
  }

  getAdvertisementsByStatus(status: AdvertisementStatus): Observable<Advertisement[]> {
    return this.advertisements$.pipe(
      map(ads => ads.filter(ad => ad.status === status))
    );
  }

  getAdvertisementsByType(type: AdvertisementType): Observable<Advertisement[]> {
    return this.advertisements$.pipe(
      map(ads => ads.filter(ad => ad.type === type))
    );
  }

  recordView(id: string): Observable<void> {
    const currentAds = this.adsSubject.value;
    const adIndex = currentAds.findIndex(ad => ad.id === id);
    
    if (adIndex !== -1) {
      const ad = currentAds[adIndex];
      const updatedAd: Advertisement = {
        ...ad,
        statistics: {
          ...ad.statistics,
          views: ad.statistics.views + 1,
          clickThroughRate: this.calculateCTR(
            ad.statistics.views + 1,
            ad.statistics.clicks
          )
        }
      };
      
      const newAds = [...currentAds];
      newAds[adIndex] = updatedAd;
      this.adsSubject.next(newAds);
      this.saveToStorage(newAds);
    }
    
    return of(void 0);
  }

  recordClick(id: string): Observable<void> {
    const currentAds = this.adsSubject.value;
    const adIndex = currentAds.findIndex(ad => ad.id === id);
    
    if (adIndex !== -1) {
      const ad = currentAds[adIndex];
      const updatedAd: Advertisement = {
        ...ad,
        statistics: {
          ...ad.statistics,
          clicks: ad.statistics.clicks + 1,
          clickThroughRate: this.calculateCTR(
            ad.statistics.views,
            ad.statistics.clicks + 1
          )
        }
      };
      
      const newAds = [...currentAds];
      newAds[adIndex] = updatedAd;
      this.adsSubject.next(newAds);
      this.saveToStorage(newAds);
    }
    
    return of(void 0);
  }

  private calculateCTR(views: number, clicks: number): number {
    return views > 0 ? (clicks / views) * 100 : 0;
  }
}
