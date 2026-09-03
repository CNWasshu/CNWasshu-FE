import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CourseColors } from '@/constants/course-colors';
import type {
  CoursePace,
  CourseUsageStatus,
  SurveyDetailResponse,
  SurveyDraftRequest,
} from '@/types/survey';

const USAGE_OPTIONS: { description: string; label: string; value: CourseUsageStatus }[] = [
  { description: '추천받은 일정을 거의 그대로 따라갔어요.', label: '대부분 그대로 이용했어요', value: 'MOSTLY_USED' },
  { description: '추천 일정 중 일부만 여행에 활용했어요.', label: '일부 일정만 이용했어요', value: 'PARTIALLY_USED' },
  { description: '추천 결과만 확인하고 실제 여행에는 이용하지 않았어요.', label: '실제로 이용하지 않았어요', value: 'NOT_USED' },
];
const NOT_USED_REASONS = [
  '일정이 맞지 않았어요', '원하는 체험이 아니었어요', '이동 거리가 부담스러웠어요',
  '계획이 변경됐어요', '추천 결과만 참고했어요',
];
const POSITIVE_TAGS = [
  '원하는 여행 스타일과 잘 맞았어요', '체험 구성이 다양했어요', '이동 동선이 효율적이었어요',
  '일정 구성이 적절했어요', '새로운 체험을 발견했어요',
];
const NEGATIVE_TAGS = [
  '원하는 체험이 아니었어요', '이동 거리가 너무 길었어요', '일정이 너무 빠듯했어요',
  '운영시간과 맞지 않았어요', '추천이 반복적이었어요', '선택한 지역이나 여행 스타일과 맞지 않았어요',
];
const PACES: { label: string; value: CoursePace }[] = [
  { label: '여유로웠어요', value: 'RELAXED' },
  { label: '적당했어요', value: 'APPROPRIATE' },
  { label: '조금 빠듯했어요', value: 'TIGHT' },
  { label: '매우 빠듯했어요', value: 'VERY_TIGHT' },
];
const SCORES = [
  { emoji: '😞', value: 1 }, { emoji: '🙁', value: 2 }, { emoji: '😐', value: 3 },
  { emoji: '🙂', value: 4 }, { emoji: '😍', value: 5 },
];

type AiSurveyFormProps = {
  error: string | null;
  saving: boolean;
  survey: SurveyDetailResponse;
  onSaveDraft: (payload: SurveyDraftRequest) => Promise<boolean>;
  onSubmit: (payload: SurveyDraftRequest) => Promise<void>;
};

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function AiSurveyForm({ error, onSaveDraft, onSubmit, saving, survey }: AiSurveyFormProps) {
  const [usageStatus, setUsageStatus] = useState<CourseUsageStatus | null>(survey.courseUsageStatus);
  const [score, setScore] = useState<number | null>(survey.overallScore);
  const [coursePace, setCoursePace] = useState<CoursePace | null>(survey.coursePace);
  const [issueTags, setIssueTags] = useState(survey.issueTags);
  const [notUsedReasons, setNotUsedReasons] = useState(survey.notUsedReasonTags);
  const [comment, setComment] = useState(survey.comment ?? '');

  const reasonOptions = useMemo(() => (score != null && score >= 4 ? POSITIVE_TAGS : NEGATIVE_TAGS), [score]);

  const selectUsage = async (value: CourseUsageStatus) => {
    if (await onSaveDraft({ courseUsageStatus: value })) setUsageStatus(value);
  };

  if (!usageStatus) {
    return (
      <View style={styles.card}>
        <Text style={styles.progress}>1/3 이용 여부</Text>
        <Text style={styles.title}>추천받은 코스를 실제 여행에 이용하셨나요?</Text>
        <View style={styles.options}>
          {USAGE_OPTIONS.map((option) => (
            <Pressable key={option.value} disabled={saving} onPress={() => void selectUsage(option.value)} style={styles.option}>
              <Text style={styles.optionText}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </Pressable>
          ))}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  if (usageStatus === 'NOT_USED') {
    return (
      <View style={styles.card}>
        <Text style={styles.progress}>미이용 사유</Text>
        <Text style={styles.title}>코스를 이용하지 않은 이유가 있나요?</Text>
        <Text style={styles.description}>선택하지 않고 바로 제출해도 괜찮아요.</Text>
        <View style={styles.tags}>
          {NOT_USED_REASONS.map((reason) => (
            <Pressable key={reason} onPress={() => setNotUsedReasons((values) => toggle(values, reason))}
              style={[styles.tag, notUsedReasons.includes(reason) && styles.selectedTag]}>
              <Text style={[styles.tagText, notUsedReasons.includes(reason) && styles.selectedText]}>{reason}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput maxLength={300} multiline onChangeText={setComment} placeholder="직접 입력 (선택)"
          style={styles.input} value={comment} />
        <Text style={styles.counter}>{comment.length}/300</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable disabled={saving}
          onPress={() => void onSubmit({ courseUsageStatus: 'NOT_USED', notUsedReasonTags: notUsedReasons, comment })}
          style={[styles.primaryButton, saving && styles.disabled]}>
          <Text style={styles.primaryButtonText}>{saving ? '제출 중...' : '설문 제출하기'}</Text>
        </Pressable>
        <Pressable disabled={saving} onPress={() => setUsageStatus(null)}>
          <Text style={styles.backText}>이용 여부 다시 선택</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.progress}>2/3 코스 평가</Text>
      <Text style={styles.title}>추천받은 코스는 전반적으로 만족스러웠나요?</Text>
      <View style={styles.scoreRow}>
        {SCORES.map((item) => (
          <Pressable key={item.value} onPress={() => { setScore(item.value); setIssueTags([]); }}
            style={[styles.score, score === item.value && styles.selectedScore]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.scoreNumber}>{item.value}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.stepLabel}>3/3 일정과 이동</Text>
      <Text style={styles.label}>추천 코스의 일정과 이동은 적절했나요?</Text>
      <View style={styles.options}>
        {PACES.map((pace) => (
          <Pressable key={pace.value} onPress={() => setCoursePace(pace.value)}
            style={[styles.option, coursePace === pace.value && styles.selectedOption]}>
            <Text style={[styles.optionText, coursePace === pace.value && styles.selectedText]}>{pace.label}</Text>
          </Pressable>
        ))}
      </View>

      {score != null ? (
        <>
          <Text style={styles.label}>추천 코스에서 좋았거나 아쉬웠던 점을 선택해 주세요.</Text>
          <View style={styles.tags}>
            {reasonOptions.map((tag) => (
              <Pressable key={tag} onPress={() => setIssueTags((values) => toggle(values, tag))}
                style={[styles.tag, issueTags.includes(tag) && styles.selectedTag]}>
                <Text style={[styles.tagText, issueTags.includes(tag) && styles.selectedText]}>{tag}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      <TextInput maxLength={300} multiline onChangeText={setComment} placeholder="직접 입력 (선택)"
        style={styles.input} value={comment} />
      <Text style={styles.counter}>{comment.length}/300</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable disabled={score == null || !coursePace || saving}
        onPress={() => void onSubmit({ courseUsageStatus: usageStatus, overallScore: score!, coursePace: coursePace!, issueTags, comment })}
        style={[styles.primaryButton, (score == null || !coursePace || saving) && styles.disabled]}>
        <Text style={styles.primaryButtonText}>{saving ? '제출 중...' : '설문 제출하기'}</Text>
      </Pressable>
      <Pressable disabled={saving} onPress={() => setUsageStatus(null)}>
        <Text style={styles.backText}>이용 여부 다시 선택</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 24, borderWidth: 1, gap: 14, padding: 20 },
  progress: { color: CourseColors.primary, fontSize: 12, fontWeight: '900' },
  stepLabel: { color: CourseColors.primary, fontSize: 12, fontWeight: '900', marginTop: 8 },
  title: { color: CourseColors.text, fontSize: 21, fontWeight: '900', lineHeight: 29 },
  description: { color: CourseColors.muted, fontSize: 13, lineHeight: 20 },
  label: { color: CourseColors.text, fontSize: 14, fontWeight: '800' },
  options: { gap: 9 },
  option: { borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, gap: 4, minHeight: 50, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 11 },
  selectedOption: { backgroundColor: CourseColors.primary, borderColor: CourseColors.primary },
  optionText: { color: CourseColors.text, fontWeight: '800' },
  optionDescription: { color: CourseColors.muted, fontSize: 12, lineHeight: 18 },
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
  input: { borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, minHeight: 90, padding: 13, textAlignVertical: 'top' },
  counter: { color: CourseColors.muted, fontSize: 11, textAlign: 'right' },
  primaryButton: { alignItems: 'center', backgroundColor: CourseColors.primary, borderRadius: 14, justifyContent: 'center', minHeight: 52 },
  primaryButtonText: { color: CourseColors.white, fontWeight: '900' },
  backText: { color: CourseColors.muted, fontSize: 13, fontWeight: '700', paddingVertical: 7, textAlign: 'center' },
  disabled: { opacity: 0.45 },
  error: { color: CourseColors.error, fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
