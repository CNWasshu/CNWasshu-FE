export type ActivityStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'ENDED';

export interface ActivityDetailResponse {
  id: number;

  title: string;
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
  duration: number | null;

  reservationRequired: boolean | null;
  todayAvailable: boolean | null;

  thumbnail: string | null;

  status: ActivityStatus;
  startDate: string | null;
  endDate: string | null;

  images: string[];
}