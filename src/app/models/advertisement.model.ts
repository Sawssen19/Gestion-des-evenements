export interface AdvertisementStatistics {
  views: number;
  clicks: number;
  clickThroughRate: number;
  revenue: number;
}

export type AdvertisementStatus = 'active' | 'scheduled' | 'ended' | 'paused';
export type AdvertisementType = 'banner' | 'video' | 'sponsored';
export type AdvertisementPosition = 'header' | 'sidebar' | 'content' | 'footer';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  startDate: Date;
  endDate: Date;
  type: AdvertisementType;
  position: AdvertisementPosition;
  status: AdvertisementStatus;
  statistics: AdvertisementStatistics;
  targetAudience?: string[];
}

export interface CreateAdvertisementDTO {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  startDate: Date;
  endDate: Date;
  type: AdvertisementType;
  position: AdvertisementPosition;
  status?: AdvertisementStatus;
  targetAudience?: string[];
}
