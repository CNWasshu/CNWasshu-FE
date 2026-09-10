export type SurveyType = 'USER_COURSE' | 'AI_COURSE';

export type SurveyStatus =
  | 'SCHEDULED'
  | 'SENT'
  | 'OPENED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NOT_USED'
  | 'SNOOZED'
  | 'EXPIRED'
  | 'CANCELED';

export type CourseUsageStatus =
  | 'MOSTLY_USED'
  | 'PARTIALLY_USED'
  | 'NOT_USED';

export type CoursePace =
  | 'RELAXED'
  | 'APPROPRIATE'
  | 'TIGHT'
  | 'VERY_TIGHT';

export type VisitStatus =
  | 'PENDING'
  | 'VISITED'
  | 'NOT_VISITED'
  | 'UNKNOWN'
  | 'SKIPPED'
  | 'RATED';

export type VisitEvidenceType =
  | 'QR'
  | 'STAMP'
  | 'RESERVATION'
  | 'USER_RESPONSE'
  | 'NONE';

export interface ActivitySurveyResponse {
  surveyId: number;
  courseItemId: number;
  activityId: number;
  activityTitle: string | null;
  visitStatus: VisitStatus;
  visitEvidenceType: VisitEvidenceType;
  recommended: boolean | null;
  satisfactionScore: number | null;
  reasonTags: string[];
  comment: string | null;
}

export interface SurveyDetailResponse {
  surveyId: number;
  courseId: number;
  courseName: string;
  courseDate: string;
  surveyType: SurveyType;
  status: SurveyStatus;
  scheduledAt: string;
  sentAt: string | null;
  openedAt: string | null;
  completedAt: string | null;
  reminderCount: number;
  courseUsageStatus: CourseUsageStatus | null;
  overallScore: number | null;
  coursePace: CoursePace | null;
  issueTags: string[];
  notUsedReasonTags: string[];
  comment: string | null;
  activities: ActivitySurveyResponse[];
}

export interface ActivitySurveyDraftRequest {
  courseItemId: number;
  visitStatus?: VisitStatus;
  recommended?: boolean;
  satisfactionScore?: number;
  reasonTags?: string[];
  comment?: string;
}

export interface SurveyDraftRequest {
  courseUsageStatus?: CourseUsageStatus;
  overallScore?: number;
  coursePace?: CoursePace;
  issueTags?: string[];
  notUsedReasonTags?: string[];
  comment?: string;
  activities?: ActivitySurveyDraftRequest[];
}

export interface SurveyApiErrorBody {
  code?: string;
  message?: string;
}

export type SurveyDetailApiResponse = Omit<
  SurveyDetailResponse,
  'activities' | 'issueTags' | 'notUsedReasonTags'
> & {
  issueTags: string | null;
  notUsedReasonTags: string | null;
  activities: (Omit<ActivitySurveyResponse, 'reasonTags'> & {
    reasonTags: string | null;
  })[];
};
