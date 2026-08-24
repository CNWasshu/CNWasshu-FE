export type RestaurantStatus =
  | 'OPEN'
  | 'CLOSED';

export interface RestaurantDetailResponse {
  id: number;

  name: string;
  shortDescription: string | null;
  description: string | null;

  regionId: number;
  regionName: string;

  categoryId: number;
  categoryName: string;

  address: string;
  longitude: number | null;
  latitude: number | null;
  phone: string | null;

  operatingStartTime: string | null;
  operatingEndTime: string | null;

  thumbnail: string | null;

  status: RestaurantStatus;

  images: string[];
}