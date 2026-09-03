import { StyleSheet, Text, View } from 'react-native';

import { BackHeader } from '@/components/common/BackHeader';
import { CourseColors } from '@/constants/course-colors';
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
    <View style={styles.hero}>
      <BackHeader />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>약 1분 소요</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {courseName ? <Text style={styles.courseName}>{courseName}</Text> : null}
      <Text style={styles.description}>
        {courseDate ? `${formatCourseDate(courseDate)} 여행 경험을 알려주세요.` : '여행 경험을 알려주세요.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: CourseColors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 11,
    paddingBottom: 40,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  badgeText: { color: CourseColors.white, fontSize: 12, fontWeight: '800' },
  title: { color: CourseColors.white, fontSize: 28, fontWeight: '900' },
  courseName: { color: '#F4FAF1', fontSize: 17, fontWeight: '800' },
  description: { color: '#E4EFE1', fontSize: 14, lineHeight: 21 },
});
