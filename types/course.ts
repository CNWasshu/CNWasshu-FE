export type CourseType = 'USER' | 'AI';

export interface CourseSummary {
  id: number;
  courseName: string;
  courseType: CourseType;
  startDate: string;
  endDate: string;
  itemCount: number;
}

export interface CourseItem {
  id: number | null;
  activityId: number | null;
  reservationId: number | null;
  title: string;
  dayNo: number;
  startTime: string;
  endTime: string;
  sortOrder: number;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  memo: string | null;
}

export interface CourseDetail {
  id: number;
  courseName: string;
  courseType: CourseType;
  peopleCount: number;
  withChild: boolean;
  startDate: string;
  endDate: string;
  items: CourseItem[];
}

export type Transportation = 'CAR' | 'PUBLIC_TRANSIT' | 'WALKING';
export type TravelStyle = 'HEALING' | 'WITH_CHILD' | 'FOOD' | 'PHOTO_SPOT';

export interface AiRecommendationRequest {
  startDate: string;
  endDate: string;
  region: string;
  peopleCount: number;
  transportation: Transportation;
  travelStyle: TravelStyle;
}

export interface AiRecommendationResponse {
  suggestedCourseName: string;
  items: CourseItem[];
}

export interface CourseItemSaveRequest {
  activityId: number | null;
  reservationId: number | null;
  title: string;
  dayNo: number;
  startTime: string;
  endTime: string;
  memo: string | null;
  sortOrder: number;
}

export interface AiCourseSaveRequest {
  courseName: string;
  peopleCount: number;
  withChild: boolean;
  startDate: string;
  endDate: string;
  items: CourseItemSaveRequest[];
}

export interface ApiErrorBody {
  code?: string;
  message?: string;
}
