import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CourseColors } from '@/constants/course-colors';
import type {
  ActivitySurveyDraftRequest,
  ActivitySurveyResponse,
  CoursePace,
  SurveyDetailResponse,
  SurveyDraftRequest,
  VisitStatus,
} from '@/types/survey';

const POSITIVE_TAGS = [
  '체험 내용이 재미있어요', '진행자가 친절해요', '가족과 함께하기 좋아요',
  '지역 특색이 있어요', '가격이 합리적이에요', '시설이 쾌적해요',
];
const NEGATIVE_TAGS = [
  '안내와 실제 내용이 달라요', '대기 시간이 길어요', '가격이 아쉬워요',
  '시설이 불편해요', '진행이 미숙해요', '찾아가기 어려워요',
];
const COURSE_ISSUES = [
  '체험 사이 이동 시간이 부족했어요', '이동 거리가 너무 길었어요', '대기 시간이 길었어요',
  '체험 시간이 너무 길었어요', '체험 시간이 너무 짧았어요', '특별히 불편하지 않았어요',
];
const PACES: { label: string; value: CoursePace }[] = [
  { label: '여유로웠어요', value: 'RELAXED' },
  { label: '적당했어요', value: 'APPROPRIATE' },
  { label: '조금 빠듯했어요', value: 'TIGHT' },
  { label: '매우 빠듯했어요', value: 'VERY_TIGHT' },
];
const SCORES = [
  { emoji: '😞', label: '매우 아쉬워요', value: 1 },
  { emoji: '🙁', label: '아쉬워요', value: 2 },
  { emoji: '😐', label: '보통이에요', value: 3 },
  { emoji: '🙂', label: '만족해요', value: 4 },
  { emoji: '😍', label: '매우 만족해요', value: 5 },
];

type ManualSurveyFormProps = {
  error: string | null;
  saving: boolean;
  survey: SurveyDetailResponse;
  onSaveDraft: (payload: SurveyDraftRequest) => Promise<boolean>;
  onSubmit: (payload: SurveyDraftRequest) => Promise<void>;
};

type ActivityAnswer = {
  comment: string;
  reasonTags: string[];
  satisfactionScore: number | null;
  visitStatus: VisitStatus;
};

function initialAnswer(activity: ActivitySurveyResponse): ActivityAnswer {
  return {
    comment: activity.comment ?? '',
    reasonTags: activity.reasonTags,
    satisfactionScore: activity.satisfactionScore,
    visitStatus: activity.visitStatus,
  };
}

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function ManualSurveyForm({ error, onSaveDraft, onSubmit, saving, survey }: ManualSurveyFormProps) {
  const [activityIndex, setActivityIndex] = useState(0);
  const [courseStep, setCourseStep] = useState(survey.activities.length === 0);
  const [answers, setAnswers] = useState<Record<number, ActivityAnswer>>(() =>
    Object.fromEntries(survey.activities.map((activity) => [activity.courseItemId, initialAnswer(activity)]))
  );
  const [coursePace, setCoursePace] = useState<CoursePace | null>(survey.coursePace);
  const [issueTags, setIssueTags] = useState(survey.issueTags);
  const [courseComment, setCourseComment] = useState(survey.comment ?? '');

  const activity = survey.activities[activityIndex];
  const answer = activity ? answers[activity.courseItemId] : null;
  const needsVisitQuestion = answer?.visitStatus === 'PENDING';
  const reasonOptions = useMemo(
    () => (answer?.satisfactionScore != null && answer.satisfactionScore >= 4 ? POSITIVE_TAGS : NEGATIVE_TAGS),
    [answer?.satisfactionScore]
  );

  const updateAnswer = (updates: Partial<ActivityAnswer>) => {
    if (!activity || !answer) return;
    setAnswers((current) => ({
      ...current,
      [activity.courseItemId]: { ...answer, ...updates },
    }));
  };

  const moveNext = () => {
    if (activityIndex + 1 < survey.activities.length) setActivityIndex((value) => value + 1);
    else setCourseStep(true);
  };

  const saveActivity = async (overrides?: Partial<ActivityAnswer>) => {
    if (!activity || !answer) return;
    const next = { ...answer, ...overrides };
    updateAnswer(overrides ?? {});
    const payload: ActivitySurveyDraftRequest = {
      courseItemId: activity.courseItemId,
      visitStatus: next.visitStatus,
      ...(next.satisfactionScore != null ? { satisfactionScore: next.satisfactionScore } : {}),
      reasonTags: next.reasonTags,
      comment: next.comment,
    };
    if (await onSaveDraft({ activities: [payload] })) moveNext();
  };

  if (courseStep) {
    return (
      <View style={styles.card}>
        <Text style={styles.progress}>코스 평가</Text>
        <Text style={styles.title}>오늘 코스의 일정과 이동은 적절했나요?</Text>
        <View style={styles.options}>
          {PACES.map((pace) => (
            <Pressable
              key={pace.value}
              onPress={() => setCoursePace(pace.value)}
              style={[styles.option, coursePace === pace.value && styles.selectedOption]}>
              <Text style={[styles.optionText, coursePace === pace.value && styles.selectedText]}>{pace.label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>이동이나 일정에서 불편했던 점이 있나요?</Text>
        <View style={styles.tags}>
          {COURSE_ISSUES.map((tag) => (
            <Pressable key={tag} onPress={() => setIssueTags((values) => toggle(values, tag))}
              style={[styles.tag, issueTags.includes(tag) && styles.selectedTag]}>
              <Text style={[styles.tagText, issueTags.includes(tag) && styles.selectedText]}>{tag}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          maxLength={300}
          multiline
          onChangeText={setCourseComment}
          placeholder="직접 입력 (선택)"
          style={styles.input}
          value={courseComment}
        />
        <Text style={styles.counter}>{courseComment.length}/300</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          disabled={!coursePace || saving}
          onPress={() => void onSubmit({ coursePace: coursePace!, issueTags, comment: courseComment })}
          style={[styles.primaryButton, (!coursePace || saving) && styles.disabled]}>
          <Text style={styles.primaryButtonText}>{saving ? '제출 중...' : '설문 제출하기'}</Text>
        </Pressable>
      </View>
    );
  }

  if (!activity || !answer) return null;

  if (needsVisitQuestion) {
    return (
      <View style={styles.card}>
        <Text style={styles.progress}>{activityIndex + 1}/{survey.activities.length} 체험</Text>
        <Text style={styles.eyebrow}>{activity.activityTitle ?? '체험'}</Text>
        <Text style={styles.title}>이 체험에 실제로 방문하셨나요?</Text>
        <View style={styles.options}>
          {[
            ['VISITED', '방문했어요'], ['NOT_VISITED', '방문하지 않았어요'], ['UNKNOWN', '기억나지 않아요'],
          ].map(([value, label]) => (
            <Pressable key={value} disabled={saving}
              onPress={() => {
                const visitStatus = value as VisitStatus;
                updateAnswer({ visitStatus });
                if (visitStatus !== 'VISITED') void saveActivity({ visitStatus });
              }}
              style={styles.option}>
              <Text style={styles.optionText}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable disabled={saving} onPress={() => void saveActivity({ visitStatus: 'SKIPPED' })}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.progress}>{activityIndex + 1}/{survey.activities.length} 체험</Text>
      <Text style={styles.eyebrow}>{activity.activityTitle ?? '체험'}</Text>
      <Text style={styles.title}>체험은 어떠셨나요?</Text>
      <View style={styles.scoreRow}>
        {SCORES.map((score) => (
          <Pressable key={score.value} onPress={() => updateAnswer({ satisfactionScore: score.value, reasonTags: [] })}
            style={[styles.score, answer.satisfactionScore === score.value && styles.selectedScore]}>
            <Text style={styles.emoji}>{score.emoji}</Text>
            <Text style={styles.scoreNumber}>{score.value}</Text>
          </Pressable>
        ))}
      </View>
      {answer.satisfactionScore != null ? (
        <>
          <Text style={styles.label}>그렇게 느낀 이유를 선택해 주세요. (선택)</Text>
          <View style={styles.tags}>
            {reasonOptions.map((tag) => (
              <Pressable key={tag} onPress={() => updateAnswer({ reasonTags: toggle(answer.reasonTags, tag) })}
                style={[styles.tag, answer.reasonTags.includes(tag) && styles.selectedTag]}>
                <Text style={[styles.tagText, answer.reasonTags.includes(tag) && styles.selectedText]}>{tag}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput maxLength={300} multiline onChangeText={(comment) => updateAnswer({ comment })}
            placeholder="직접 입력 (선택)" style={styles.input} value={answer.comment} />
          <Text style={styles.counter}>{answer.comment.length}/300</Text>
        </>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable disabled={answer.satisfactionScore == null || saving} onPress={() => void saveActivity({ visitStatus: 'RATED' })}
        style={[styles.primaryButton, (answer.satisfactionScore == null || saving) && styles.disabled]}>
        <Text style={styles.primaryButtonText}>{saving ? '저장 중...' : '다음'}</Text>
      </Pressable>
      <Pressable disabled={saving} onPress={() => void saveActivity({ visitStatus: 'SKIPPED' })}>
        <Text style={styles.skipText}>이 체험 건너뛰기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 22, borderWidth: 1, gap: 16, padding: 22 },
  progress: { alignSelf: 'flex-start', backgroundColor: CourseColors.primarySoft, borderRadius: 999, color: CourseColors.primaryDark, fontSize: 12, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6 },
  eyebrow: { color: CourseColors.primaryDark, fontSize: 15, fontWeight: '800' },
  title: { color: CourseColors.text, fontSize: 21, fontWeight: '900', lineHeight: 29 },
  label: { color: CourseColors.text, fontSize: 14, fontWeight: '800', marginTop: 4 },
  options: { gap: 9 },
  option: { backgroundColor: CourseColors.background, borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, minHeight: 50, justifyContent: 'center', paddingHorizontal: 16 },
  selectedOption: { backgroundColor: CourseColors.primary, borderColor: CourseColors.primary },
  optionText: { color: CourseColors.text, fontWeight: '700' },
  selectedText: { color: CourseColors.white },
  scoreRow: { flexDirection: 'row', gap: 7, justifyContent: 'space-between' },
  score: { alignItems: 'center', borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, flex: 1, gap: 3, paddingVertical: 10 },
  selectedScore: { backgroundColor: CourseColors.primarySoft, borderColor: CourseColors.primary },
  emoji: { fontSize: 24 },
  scoreNumber: { color: CourseColors.text, fontSize: 12, fontWeight: '800' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderColor: CourseColors.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  selectedTag: { backgroundColor: CourseColors.primary, borderColor: CourseColors.primary },
  tagText: { color: CourseColors.text, fontSize: 12, fontWeight: '700' },
  input: { backgroundColor: CourseColors.background, borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, color: CourseColors.text, minHeight: 100, padding: 14, textAlignVertical: 'top' },
  counter: { color: CourseColors.muted, fontSize: 11, textAlign: 'right' },
  primaryButton: { alignItems: 'center', backgroundColor: CourseColors.primary, borderRadius: 15, minHeight: 52, justifyContent: 'center', marginTop: 2 },
  primaryButtonText: { color: CourseColors.white, fontWeight: '900' },
  disabled: { opacity: 0.45 },
  skipText: { color: CourseColors.muted, fontSize: 13, fontWeight: '700', paddingVertical: 7, textAlign: 'center' },
  error: { color: CourseColors.error, fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
