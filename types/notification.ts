export type NotificationType = 'COURSE' | 'RESERVATION' | 'SURVEY';

export interface NotificationResponse {
  notificationId: number;
  notificationType: NotificationType;
  courseId: number | null;
  reservationId: number | null;
  activityId: number | null;
  courseSurveyId: number | null;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface NotificationSettingResponse {
  courseDayBefore: boolean;
  reservationDayBefore: boolean;
  reservation3hBefore: boolean;
  reservation1hBefore: boolean;
  reservation30mBefore: boolean;
  surveyEnabled: boolean;
}

export interface NotificationSettingUpdateRequest {
  courseDayBefore?: boolean;
  reservationDayBefore?: boolean;
  reservation3hBefore?: boolean;
  reservation1hBefore?: boolean;
  reservation30mBefore?: boolean;
  surveyEnabled?: boolean;
}

export interface NotificationApiErrorBody {
  code?: string;
  message?: string;
}
