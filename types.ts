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
