export type BookmarkType = 'ACTIVITY' | 'RESTAURANT';

export interface BookmarkRequest {
  type: BookmarkType;
  targetId: number;
}

export interface BookmarkResponse {
  bookmarkId: number;
  type: BookmarkType;
  targetId: number;
  title: string;
  thumbnail: string | null;
  regionName: string;
  categoryName: string;
  operatingStartTime: string | null;
  operatingEndTime: string | null;
  reservationRequired: boolean | null;
  createdAt: string;
}