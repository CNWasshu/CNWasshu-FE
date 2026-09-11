import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getSurveyErrorMessage, surveyApi } from '@/api/surveyApi';
import { AiSurveyForm } from '@/components/survey/AiSurveyForm';
import { ManualSurveyForm } from '@/components/survey/ManualSurveyForm';
import { SurveyHeader } from '@/components/survey/SurveyHeader';
import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';
import type { SurveyDetailResponse, SurveyDraftRequest } from '@/types/survey';
import { clearTokens, getAccessToken, isSessionExpiredError } from '@/utils/auth';

const CLOSED_STATUSES = new Set(['CANCELED', 'EXPIRED']);
const FINISHED_STATUSES = new Set(['COMPLETED', 'NOT_USED']);

export default function SurveyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ surveyId?: string | string[] }>();
  const surveyId = useMemo(() => {
    const value = Array.isArray(params.surveyId) ? params.surveyId[0] : params.surveyId;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [params.surveyId]);

  const [survey, setSurvey] = useState<SurveyDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [snoozed, setSnoozed] = useState(false);
  const isSnoozed = snoozed || survey?.status === 'SNOOZED';

  const loadSurvey = useCallback(async () => {
    if (!surveyId) {
      setError('만족도 조사 주소가 올바르지 않습니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        router.replace('/auth/login');
        return;
      }
      setSurvey(await surveyApi.getSurvey(surveyId, accessToken));
    } catch (requestError) {
      if (isSessionExpiredError(requestError)) {
        await clearTokens();
        router.replace('/auth/login');
        return;
      }
      setError(getSurveyErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [router, surveyId]);

  useEffect(() => {
    void loadSurvey();
  }, [loadSurvey]);

  const saveDraft = async (payload: SurveyDraftRequest) => {
    if (!surveyId) return false;
    setSaving(true);
    setActionError(null);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        router.replace('/auth/login');
        return false;
      }
      setSurvey(await surveyApi.saveDraft(surveyId, payload, accessToken));
      return true;
    } catch (requestError) {
      setActionError(getSurveyErrorMessage(requestError));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const submitSurvey = async (payload: SurveyDraftRequest) => {
    if (!surveyId) return;
    setSaving(true);
    setActionError(null);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        router.replace('/auth/login');
        return;
      }
      await surveyApi.saveDraft(surveyId, payload, accessToken);
      const completed = await surveyApi.submit(surveyId, accessToken);
      router.replace({
        pathname: '/survey/result',
        params: {
          courseName: completed.courseName,
          result: completed.status,
        },
      });
    } catch (requestError) {
      setActionError(getSurveyErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const snoozeSurvey = async () => {
    if (!surveyId) return;
    setSaving(true);
    setActionError(null);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        router.replace('/auth/login');
        return;
      }
      await surveyApi.snooze(surveyId, accessToken);
      setSnoozed(true);
    } catch (requestError) {
      if (isSessionExpiredError(requestError)) {
        await clearTokens();
        router.replace('/auth/login');
        return;
      }
      setActionError(getSurveyErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.screen}>
          <SurveyHeader
            courseDate={survey?.courseDate}
            courseName={survey?.courseName}
            surveyType={survey?.surveyType}
          />

          <View style={styles.body}>
          {loading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator color={CourseColors.primary} size="large" />
              <Text style={styles.stateText}>만족도 조사를 불러오고 있어요.</Text>
            </View>
          ) : null}

          {!loading && error ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateIcon}>!</Text>
              <Text style={styles.stateTitle}>설문을 불러오지 못했어요</Text>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={() => void loadSurvey()} style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>다시 시도</Text>
              </Pressable>
            </View>
          ) : null}

          {!loading && survey && CLOSED_STATUSES.has(survey.status) ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateIcon}>✓</Text>
              <Text style={styles.stateTitle}>종료된 만족도 조사예요</Text>
              <Text style={styles.stateText}>코스가 변경되었거나 응답 기간이 지나 설문이 종료되었어요.</Text>
              <Pressable onPress={() => router.back()} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>확인</Text>
              </Pressable>
            </View>
          ) : null}

          {!loading && survey && FINISHED_STATUSES.has(survey.status) ? (
            <View style={styles.stateCard}>
              <Text style={styles.completeIcon}>✓</Text>
              <Text style={styles.stateTitle}>이미 참여한 만족도 조사예요</Text>
              <Text style={styles.stateText}>소중한 의견을 남겨주셔서 감사합니다.</Text>
              <Pressable onPress={() => router.back()} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>확인</Text>
              </Pressable>
            </View>
          ) : null}

          {!loading && survey && isSnoozed ? (
            <View style={styles.stateCard}>
              <Text style={styles.completeIcon}>✓</Text>
              <Text style={styles.stateTitle}>내일 다시 알려드릴게요</Text>
              <Text style={styles.stateText}>내일 오전 10시에 만족도 조사 알림을 다시 보내드려요.</Text>
              <Pressable onPress={() => router.replace('/notification')} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>알림함으로 돌아가기</Text>
              </Pressable>
            </View>
          ) : null}

          {!loading && survey && !isSnoozed && survey.surveyType === 'USER_COURSE'
          && !CLOSED_STATUSES.has(survey.status) && !FINISHED_STATUSES.has(survey.status) ? (
            <>
              <ManualSurveyForm
                error={actionError}
                onSaveDraft={saveDraft}
                onSubmit={submitSurvey}
                saving={saving}
                survey={survey}
              />
              <Pressable disabled={saving} onPress={() => void snoozeSurvey()} style={styles.snoozeButton}>
                <Text style={styles.snoozeButtonText}>내일 다시 알림</Text>
              </Pressable>
            </>
          ) : null}

          {!loading && survey && !isSnoozed && survey.surveyType === 'AI_COURSE'
          && !CLOSED_STATUSES.has(survey.status) && !FINISHED_STATUSES.has(survey.status) ? (
            <>
              <AiSurveyForm
                error={actionError}
                onSaveDraft={saveDraft}
                onSubmit={submitSurvey}
                saving={saving}
                survey={survey}
              />
              <Pressable disabled={saving} onPress={() => void snoozeSurvey()} style={styles.snoozeButton}>
                <Text style={styles.snoozeButtonText}>내일 다시 알림</Text>
              </Pressable>
            </>
          ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: CourseColors.primary, flex: 1 },
  container: { alignItems: 'center', backgroundColor: CourseColors.background, flexGrow: 1 },
  screen: {
    backgroundColor: CourseColors.background,
    flex: 1,
    paddingBottom: 44,
    width: '100%',
  },
  body: { alignSelf: 'center', marginTop: PAGE_LAYOUT.sectionSpacing, maxWidth: PAGE_LAYOUT.desktopMaxWidth, paddingHorizontal: 18, width: '100%' },
  stateCard: {
    alignItems: 'center', backgroundColor: CourseColors.white, borderColor: CourseColors.border,
    borderRadius: 22, borderWidth: 1, gap: 14, justifyContent: 'center', minHeight: 250, padding: 26,
  },
  stateIcon: {
    backgroundColor: '#FFF1ED', borderRadius: 25, color: CourseColors.error, fontSize: 22,
    fontWeight: '900', height: 50, paddingTop: 11, textAlign: 'center', width: 50,
  },
  completeIcon: {
    backgroundColor: CourseColors.primarySoft, borderRadius: 25, color: CourseColors.primary,
    fontSize: 22, fontWeight: '900', height: 50, paddingTop: 11, textAlign: 'center', width: 50,
  },
  stateTitle: { color: CourseColors.text, fontSize: 20, fontWeight: '900', textAlign: 'center' },
  stateText: { color: CourseColors.muted, lineHeight: 22, textAlign: 'center' },
  errorText: { color: CourseColors.error, lineHeight: 22, textAlign: 'center' },
  outlineButton: {
    alignItems: 'center', alignSelf: 'stretch', borderColor: CourseColors.primary, borderRadius: 15,
    borderWidth: 1, justifyContent: 'center', minHeight: 50,
  },
  outlineButtonText: { color: CourseColors.primary, fontWeight: '900' },
  primaryButton: {
    alignItems: 'center', alignSelf: 'stretch', backgroundColor: CourseColors.primary,
    borderRadius: 15, justifyContent: 'center', minHeight: 52,
  },
  primaryButtonText: { color: CourseColors.white, fontWeight: '900' },
  snoozeButton: { alignItems: 'center', justifyContent: 'center', minHeight: 48, marginTop: 10 },
  snoozeButtonText: { color: CourseColors.muted, fontSize: 13, fontWeight: '800' },
  introCard: {
    alignItems: 'center', backgroundColor: CourseColors.white, borderColor: CourseColors.border,
    borderRadius: 26, borderWidth: 1, gap: 14, padding: 26,
  },
  introIcon: {
    alignItems: 'center', backgroundColor: CourseColors.primarySoft, borderRadius: 34,
    height: 68, justifyContent: 'center', width: 68,
  },
  introIconText: { fontSize: 30 },
  introTitle: { color: CourseColors.text, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  introDescription: { color: CourseColors.muted, lineHeight: 23, textAlign: 'center' },
  guideBox: {
    alignSelf: 'stretch', backgroundColor: CourseColors.primarySoft, borderRadius: 16,
    gap: 8, marginTop: 4, padding: 16,
  },
  guideText: { color: CourseColors.primaryDark, fontSize: 13, lineHeight: 20 },
  readyBox: {
    alignSelf: 'stretch', borderColor: CourseColors.border, borderRadius: 15,
    borderStyle: 'dashed', borderWidth: 1, marginTop: 4, padding: 15,
  },
  readyText: { color: CourseColors.muted, textAlign: 'center' },
});
