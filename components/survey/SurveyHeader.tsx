import { PageHero } from '@/components/layout';
import type { SurveyType } from '@/types/survey';

type SurveyHeaderProps = {
  courseDate?: string;
  courseName?: string;
  surveyType?: SurveyType;
};

function formatCourseDate(value?: string) {
  if (!value) return '';
  const [, month, day] = value.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

export function SurveyHeader({ courseDate, courseName, surveyType }: SurveyHeaderProps) {
  const title = surveyType === 'AI_COURSE'
    ? 'AI 추천 코스 만족도 조사'
    : '여행 만족도 조사';

  return (
    <PageHero
      badge="약 1분 소요"
      description={[
        courseName,
        courseDate ? `${formatCourseDate(courseDate)} 여행 경험을 알려주세요.` : '여행 경험을 알려주세요.',
      ].filter(Boolean).join(' · ')}
      eyebrow="여행을 돌아보는 시간"
      icon="chatbubble-ellipses-outline"
      showBack
      title={title}
    />
  );
}
