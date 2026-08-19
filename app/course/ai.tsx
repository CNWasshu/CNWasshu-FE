import { courseApi, getCourseErrorMessage } from '@/api/courseApi';
import { AiCourseForm } from '@/components/course/AiCourseForm';
import { CourseMap } from '@/components/course/CourseMap';
import { CourseSchedule } from '@/components/course/CourseSchedule';
import type { AiRecommendationRequest, AiRecommendationResponse } from '@/types/course';
import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AiCourseScreen() {
  const router = useRouter();
  const requestLock = useRef(false);
  const [conditions, setConditions] = useState<AiRecommendationRequest | null>(null);
  const [result, setResult] = useState<AiRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null); const [saved, setSaved] = useState(false);

  const recommend = async (request: AiRecommendationRequest) => {
    if (requestLock.current) return;
    requestLock.current = true; setLoading(true); setError(null); setResult(null); setSaved(false);
    try { setResult(await courseApi.recommend(request)); setConditions(request); }
    catch (requestError) { setError(getCourseErrorMessage(requestError)); }
    finally { setLoading(false); requestLock.current = false; }
  };

  const save = async () => {
    if (!result || !conditions || requestLock.current) return;
    requestLock.current = true; setSaving(true); setError(null);
    try {
      await courseApi.saveRecommendation({
        courseName: result.suggestedCourseName,
        peopleCount: conditions.peopleCount,
        withChild: conditions.travelStyle === 'WITH_CHILD',
        startDate: conditions.startDate,
        endDate: conditions.endDate,
        items: result.items.map(({ activityId, reservationId, title, dayNo, startTime, endTime, memo, sortOrder }) => ({
          activityId, reservationId, title, dayNo, startTime, endTime, memo, sortOrder,
        })),
      });
      setSaved(true);
      setTimeout(() => router.replace('/(tabs)/course'), 700);
    } catch (requestError) { setError(getCourseErrorMessage(requestError)); }
    finally { setSaving(false); requestLock.current = false; }
  };

  return <SafeAreaView style={styles.safe} edges={['bottom']}>
    <Stack.Screen options={{ title: 'AI 코스 추천', headerBackTitle: '코스' }} />
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AiCourseForm loading={loading || saving} onSubmit={(request) => void recommend(request)} />
      {loading ? <View style={styles.loading}><ActivityIndicator size="large" color="#2F80ED" /><Text style={styles.muted}>Gemini가 여행 코스를 만들고 있습니다.</Text></View> : null}
      {error ? <View style={styles.errorBox}><Text style={styles.error}>{error}</Text></View> : null}
      {result ? <View style={styles.result}>
        <View><Text style={styles.eyebrow}>추천 결과</Text><Text style={styles.title}>{result.suggestedCourseName}</Text></View>
        <CourseMap items={result.items} />
        <CourseSchedule items={result.items} />
        {saved ? <Text style={styles.saved}>코스를 저장했습니다. 목록으로 이동합니다.</Text> : null}
        <Pressable disabled={saving || saved} onPress={() => void save()} style={[styles.saveButton, (saving || saved) && styles.disabled]}><Text style={styles.saveText}>{saving ? '저장 중...' : saved ? '저장 완료' : '추천 코스 저장'}</Text></Pressable>
      </View> : null}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' }, container: { padding: 20, paddingBottom: 50, gap: 24 },
  loading: { padding: 34, alignItems: 'center', gap: 12 }, muted: { color: '#6B7280' }, errorBox: { backgroundColor: '#FEF3F2', borderRadius: 12, padding: 14 }, error: { color: '#B42318', textAlign: 'center' },
  result: { gap: 22 }, eyebrow: { color: '#2F80ED', fontWeight: '800', marginBottom: 5 }, title: { fontSize: 25, fontWeight: '900', color: '#111827' },
  saveButton: { backgroundColor: '#176B4D', borderRadius: 14, paddingVertical: 15, alignItems: 'center' }, saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' }, disabled: { opacity: 0.55 }, saved: { color: '#176B4D', textAlign: 'center', fontWeight: '800' },
});
