export type DownloadQuality = 'Good' | 'Better' | 'Best';

export interface Movie {
  id: number;
  posterUrl: string;
  progress?: number;
  title: string;
  year: number;
  duration: string;
  rating: string;
  description: string;
  backdropUrl: string;
  baseSize?: number; // Base size in GB for 'Better' quality
  downloadQuality?: DownloadQuality;
  size?: number; // Actual downloaded size in GB
}

export interface CarouselItem {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  showBrand?: boolean;
}

export interface Profile {
  id: number;
  name: string;
  avatarUrl: string;
  isKid?: boolean;
}

export interface Channel {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
  price: string;
  subscribed?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}
