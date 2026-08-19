import { courseApi, getCourseErrorMessage } from '@/api/courseApi';
import { AiCourseForm } from '@/components/course/AiCourseForm';
import { CourseMap } from '@/components/course/CourseMap';
import { CourseSchedule } from '@/components/course/CourseSchedule';
import { CourseColors } from '@/constants/course-colors';
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
        items: result.items.map(({ activityId, reservationId, title, dayNo, startTime, endTime, address, latitude, longitude, memo, sortOrder }) => ({
          activityId, reservationId, title, dayNo, startTime, endTime, address, latitude, longitude, memo, sortOrder,
        })),
      });
      setSaved(true);
      setTimeout(() => router.replace('/(tabs)/course'), 700);
    } catch (requestError) { setError(getCourseErrorMessage(requestError)); }
    finally { setSaving(false); requestLock.current = false; }
  };

  return <SafeAreaView style={styles.safe} edges={['bottom']}>
    <Stack.Screen options={{ title: 'AI 코스 추천', headerBackTitle: '코스', headerStyle: { backgroundColor: CourseColors.primary }, headerTintColor: CourseColors.white, headerShadowVisible: false }} />
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <View style={styles.heroTop}><Text style={styles.heroTitle}>AI 코스 추천</Text><Text style={styles.heroBadge}>조건 기반 추천</Text></View>
        <Text style={styles.heroHeadline}>여행 조건을 입력하면{`\n`}코스를 추천해드려요</Text>
        <Text style={styles.heroDescription}>날짜, 충남 지역, 인원, 여행 스타일을 기준으로{`\n`}나에게 꼭 맞는 코스를 구성합니다.</Text>
      </View>
      <View style={styles.body}>
      <AiCourseForm loading={loading || saving} onSubmit={(request) => void recommend(request)} />
      {loading ? <View style={styles.loading}><View style={styles.loadingIcon}><ActivityIndicator size="large" color={CourseColors.primary} /></View><Text style={styles.loadingTitle}>코스를 만들고 있어요</Text><Text style={styles.muted}>Gemini가 여행 조건에 맞는 일정을 구성합니다.</Text></View> : null}
      {error ? <View style={styles.errorBox}><Text style={styles.error}>{error}</Text></View> : null}
      {result ? <View style={styles.result}>
        <View style={styles.resultHeading}><View style={styles.sparkle}><Text style={styles.sparkleText}>✦</Text></View><View style={styles.resultTitleWrap}><Text style={styles.eyebrow}>AI 추천 코스</Text><Text style={styles.title}>{result.suggestedCourseName}</Text></View></View>
        <View style={styles.resultSection}><Text style={styles.resultSectionTitle}>코스 지도</Text><CourseMap items={result.items} /></View>
        <View style={styles.resultSection}><Text style={styles.resultSectionTitle}>Day별 추천 일정</Text><CourseSchedule items={result.items} /></View>
        {saved ? <View style={styles.savedBox}><Text style={styles.savedIcon}>✓</Text><Text style={styles.saved}>코스를 저장했습니다. 목록으로 이동합니다.</Text></View> : null}
        <Pressable disabled={saving || saved} onPress={() => void save()} style={[styles.saveButton, (saving || saved) && styles.disabled]}><Text style={styles.saveText}>{saving ? '저장 중...' : saved ? '저장 완료' : '추천 코스 저장'}</Text></Pressable>
      </View> : null}
      </View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.primary }, container: { backgroundColor: CourseColors.background, paddingBottom: 50 }, hero: { backgroundColor: CourseColors.primary, paddingHorizontal: 22, paddingTop: 7, paddingBottom: 41, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, gap: 12 }, heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 }, heroTitle: { color: CourseColors.white, fontSize: 27, fontWeight: '900' }, heroBadge: { color: '#E3F0E0', borderLeftWidth: 1, borderLeftColor: '#8DB392', paddingLeft: 10, fontSize: 12, fontWeight: '700' }, heroHeadline: { color: CourseColors.white, fontSize: 22, lineHeight: 30, fontWeight: '900', marginTop: 5 }, heroDescription: { color: '#DFECDB', lineHeight: 21, fontSize: 13 }, body: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 18, marginTop: -18, gap: 24 },
  loading: { backgroundColor: CourseColors.white, borderRadius: 22, borderWidth: 1, borderColor: CourseColors.border, padding: 28, alignItems: 'center', gap: 10 }, loadingIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: CourseColors.primarySoft, alignItems: 'center', justifyContent: 'center' }, loadingTitle: { color: CourseColors.text, fontSize: 17, fontWeight: '900', marginTop: 3 }, muted: { color: CourseColors.muted, textAlign: 'center', fontSize: 13 }, errorBox: { backgroundColor: '#FFF1ED', borderWidth: 1, borderColor: '#F0CFC6', borderRadius: 15, padding: 14 }, error: { color: CourseColors.error, textAlign: 'center' },
  result: { gap: 18, backgroundColor: CourseColors.white, borderRadius: 25, borderWidth: 1, borderColor: CourseColors.border, padding: 18, shadowColor: '#5A4932', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 }, resultHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 }, sparkle: { width: 44, height: 44, borderRadius: 22, backgroundColor: CourseColors.primarySoft, alignItems: 'center', justifyContent: 'center' }, sparkleText: { color: CourseColors.primary, fontSize: 21, fontWeight: '900' }, resultTitleWrap: { flex: 1 }, eyebrow: { color: CourseColors.primary, fontWeight: '900', fontSize: 11, letterSpacing: 0.8, marginBottom: 4 }, title: { fontSize: 22, lineHeight: 29, fontWeight: '900', color: CourseColors.text }, resultSection: { gap: 12 }, resultSectionTitle: { color: CourseColors.text, fontSize: 18, fontWeight: '900' },
  saveButton: { minHeight: 54, backgroundColor: CourseColors.primary, borderRadius: 17, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', shadowColor: CourseColors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 7, elevation: 3 }, saveText: { color: CourseColors.white, fontSize: 16, fontWeight: '900' }, disabled: { opacity: 0.55 }, savedBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: CourseColors.primarySoft, borderRadius: 13, padding: 12 }, savedIcon: { color: CourseColors.primary, fontWeight: '900' }, saved: { color: CourseColors.primaryDark, textAlign: 'center', fontWeight: '800', fontSize: 13 },
});
