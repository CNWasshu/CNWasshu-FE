export interface StampResponse {
  stampId: number;
  activityId: number;
  activityTitle: string;
  regionName: string;
  photo: string | null;
  stampedAt: string;
}

export interface StampListResponse {
  stamps: StampResponse[];
}

export interface StampCreateRequest {
  qrCode: string;
  photo?: string;
}

export interface StampApiErrorBody {
  code?: string;
  message?: string;
}
