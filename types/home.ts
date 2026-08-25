export type HomeItemType =
  | 'ACTIVITY'
  | 'RESTAURANT';

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

export type HomeResponse = HomeItem[];