export type ReservationStatus =
  | 'CONFIRMED'
  | 'CANCELLED';

export interface ReservationTimeSlot {
  time: string;
  available: boolean;
}

export interface ReservationCreateRequest {
  activityId: number;
  reservationDate: string;
  reservationTime: string;
  peopleCount: number;
  withChild: boolean;
}

export interface ReservationResponse {
  reservationId: number;

  activityId: number;
  activityTitle: string;

  reservationDate: string;
  reservationTime: string;
  endTime: string;

  peopleCount: number;
  withChild: boolean;

  status: ReservationStatus;
}