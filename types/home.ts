export type HomeItemType =
  | 'ACTIVITY'
  | 'RESTAURANT';

export type ActivityHomeSort =
  | 'DEFAULT'
  | 'RECOMMENDED'
  | 'RESERVATION'
  | 'BOOKMARK';

export type RestaurantHomeSort =
  | 'NAME'
  | 'BOOKMARK';

export interface HomeItem {
  id: number;
  type: HomeItemType;
  title: string;
  shortDescription: string | null;

  regionId: number;
  regionName: string;

  categoryId: number;
  categoryName: string;

  thumbnail: string | null;

  operatingStartTime: string | null;
  operatingEndTime: string | null;

  maxParticipants: number | null;

  reservationRequired: boolean | null;
  todayAvailable: boolean | null;

  weatherTags: string[];
  tags: string[];
}

export interface HomePageResponse {
  items: HomeItem[];

  page: number;
  size: number;

  hasNext: boolean;

  totalElements: number;
  totalPages: number;
}

export interface HomeFilterOption {
  id: number;
  name: string;
}

export interface HomeFilterOptionsResponse {
  regions: HomeFilterOption[];
  categories: HomeFilterOption[];
}

export interface WeatherResponse {
  regionName: string;
  temperature: number;
  condition:
    | 'SUNNY'
    | 'CLOUDY'
    | 'RAIN'
    | 'RAIN_SNOW'
    | 'SNOW'
    | 'UNKNOWN';
}

export type HomeResponse = HomeItem[];