export interface AdvertisementStatistics {
  views: number;
  clicks: number;
  clickThroughRate: number;
  revenue: number;
}

export interface Advertisement {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  type: 'banner' | 'video' | 'sponsored';
  position: 'header' | 'sidebar' | 'content' | 'footer';
  status: 'active' | 'paused' | 'scheduled' | 'ended';
  targetAudience?: string[];
  impressions?: number;
  clicks?: number;
  engagement?: number;
  statistics?: AdvertisementStatistics;
}
