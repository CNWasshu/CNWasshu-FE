import { courseApi, getCourseErrorMessage } from '@/api/courseApi';
import { AiCourseForm } from '@/components/course/AiCourseForm';
import { AiCourseLoading } from '@/components/course/AiCourseLoading';
import { CourseMap } from '@/components/course/CourseMap';
import { CourseSchedule } from '@/components/course/CourseSchedule';
import { CourseColors } from '@/constants/course-colors';
import type { AiRecommendationRequest, AiRecommendationResponse } from '@/types/course';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AiCourseScreen() {
  const router = useRouter();
  const requestLock = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const bodyTop = useRef(0);
  const didScrollToResult = useRef(false);
  const [conditions, setConditions] = useState<AiRecommendationRequest | null>(null);
  const [result, setResult] = useState<AiRecommendationResponse | null>(null);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null); const [saved, setSaved] = useState(false);

  const recommend = async (request: AiRecommendationRequest) => {
    if (requestLock.current) return;
    requestLock.current = true; didScrollToResult.current = false; setLoading(true); setError(null); setResult(null); setSaved(false);
    try { setResult(await courseApi.recommend(request)); setConditions(request); setFormCollapsed(true); }
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

  const editConditions = () => {
    setFormCollapsed(false);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: Math.max(bodyTop.current - 16, 0), animated: true }));
  };

  return <SafeAreaView style={styles.safe} edges={['bottom']}>
    <Stack.Screen options={{ title: 'AI 코스 추천', headerBackTitle: '코스', headerStyle: { backgroundColor: CourseColors.primary }, headerTintColor: CourseColors.white, headerShadowVisible: false }} />
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <View style={styles.heroTop}><Text style={styles.heroTitle}>AI 코스 추천</Text><Text style={styles.heroBadge}>조건 기반 추천</Text></View>
        <Text style={styles.heroHeadline}>여행 조건을 입력하면{`\n`}코스를 추천해드려요</Text>
        <Text style={styles.heroDescription}>날짜, 충남 지역, 인원, 여행 스타일을 기준으로{`\n`}나에게 꼭 맞는 코스를 구성합니다.</Text>
      </View>
      <View onLayout={({ nativeEvent }) => { bodyTop.current = nativeEvent.layout.y; }} style={styles.body}>
      <View style={formCollapsed && styles.collapsedForm}><AiCourseForm loading={loading || saving} onSubmit={(request) => void recommend(request)} onValidationError={(offsetY) => scrollRef.current?.scrollTo({ y: Math.max(bodyTop.current + offsetY - 24, 0), animated: true })} /></View>
      {loading ? <AiCourseLoading /> : null}
      {error ? <View accessibilityLiveRegion="polite" style={styles.errorBox}><Ionicons color={CourseColors.error} name="alert-circle-outline" size={22} /><View style={styles.errorContent}><Text style={styles.errorTitle}>추천 코스를 만들지 못했어요</Text><Text style={styles.error}>{error}</Text></View></View> : null}
      {result && conditions ? <View onLayout={({ nativeEvent }) => {
        if (didScrollToResult.current) return;
        didScrollToResult.current = true;
        requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: Math.max(bodyTop.current + nativeEvent.layout.y - 16, 0), animated: true }));
      }} style={styles.result}>
        <View style={styles.resultHeading}><View style={styles.sparkle}><Text style={styles.sparkleText}>✦</Text></View><View style={styles.resultTitleWrap}><Text style={styles.eyebrow}>AI 추천 코스</Text><Text style={styles.title}>{result.suggestedCourseName}</Text></View><Pressable accessibilityRole="button" onPress={editConditions} style={styles.editButton}><Text style={styles.editButtonText}>조건 수정</Text></Pressable></View>
        <View style={styles.conditionSummary}>
          <Text style={styles.conditionChip}>{conditions.region}</Text>
          <Text style={styles.conditionChip}>{conditions.startDate} ~ {conditions.endDate}</Text>
          <Text style={styles.conditionChip}>{conditions.peopleCount}명</Text>
          <Text style={styles.conditionChip}>{transportationLabel(conditions.transportation)}</Text>
          <Text style={styles.conditionChip}>{travelStyleLabel(conditions.travelStyle)}</Text>
        </View>
        {saved ? <View style={styles.savedBox}><Text style={styles.savedIcon}>✓</Text><Text style={styles.saved}>코스를 저장했습니다. 목록으로 이동합니다.</Text></View> : null}
        <Pressable accessibilityRole="button" disabled={saving || saved} onPress={() => void save()} style={[styles.saveButton, (saving || saved) && styles.disabled]}><Text style={styles.saveText}>{saving ? '저장 중...' : saved ? '저장 완료' : '추천 코스 저장'}</Text></Pressable>
        <View style={styles.resultSection}><Text style={styles.resultSectionTitle}>코스 지도</Text><CourseMap items={result.items} /></View>
        <View style={styles.resultSection}><Text style={styles.resultSectionTitle}>Day별 추천 일정</Text><CourseSchedule items={result.items} /></View>
      </View> : null}
      </View>
    </ScrollView>
  </SafeAreaView>;
}

function transportationLabel(value: AiRecommendationRequest['transportation']) {
  return { CAR: '자차', PUBLIC_TRANSIT: '대중교통', WALKING: '도보 중심' }[value];
}

function travelStyleLabel(value: AiRecommendationRequest['travelStyle']) {
  return { HEALING: '힐링', WITH_CHILD: '아이와 함께', FOOD: '먹거리 중심', PHOTO_SPOT: '사진 명소' }[value];
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.primary }, container: { backgroundColor: CourseColors.background, paddingBottom: 50 }, hero: { backgroundColor: CourseColors.primary, paddingHorizontal: 22, paddingTop: 7, paddingBottom: 41, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, gap: 12 }, heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 }, heroTitle: { color: CourseColors.white, fontSize: 27, fontWeight: '900' }, heroBadge: { color: '#E3F0E0', borderLeftWidth: 1, borderLeftColor: '#8DB392', paddingLeft: 10, fontSize: 12, fontWeight: '700' }, heroHeadline: { color: CourseColors.white, fontSize: 22, lineHeight: 30, fontWeight: '900', marginTop: 5 }, heroDescription: { color: '#DFECDB', lineHeight: 21, fontSize: 13 }, body: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 18, marginTop: -18, gap: 24 }, collapsedForm: { display: 'none' },
  errorBox: { alignItems: 'flex-start', backgroundColor: '#FFF9F6', borderWidth: 1, borderColor: '#E6BDB3', borderRadius: 14, flexDirection: 'row', gap: 9, padding: 13 }, errorContent: { flex: 1, gap: 3 }, errorTitle: { color: CourseColors.text, fontSize: 14, fontWeight: '900' }, error: { color: CourseColors.error, fontSize: 12, lineHeight: 18 },
  result: { gap: 16, backgroundColor: CourseColors.white, borderRadius: 18, borderWidth: 1, borderColor: CourseColors.border, padding: 16 }, resultHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 }, sparkle: { width: 42, height: 42, borderRadius: 21, backgroundColor: CourseColors.primarySoft, alignItems: 'center', justifyContent: 'center' }, sparkleText: { color: CourseColors.primary, fontSize: 20, fontWeight: '900' }, resultTitleWrap: { flex: 1 }, eyebrow: { color: CourseColors.primary, fontWeight: '900', fontSize: 12, marginBottom: 3 }, title: { fontSize: 21, lineHeight: 28, fontWeight: '900', color: CourseColors.text }, editButton: { borderColor: CourseColors.border, borderRadius: 12, borderWidth: 1, minHeight: 44, justifyContent: 'center', paddingHorizontal: 11 }, editButtonText: { color: CourseColors.primaryDark, fontSize: 12, fontWeight: '800' }, conditionSummary: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, conditionChip: { backgroundColor: CourseColors.background, borderColor: CourseColors.border, borderRadius: 10, borderWidth: 1, color: '#6B5730', fontSize: 12, fontWeight: '700', overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 6 }, resultSection: { gap: 12 }, resultSectionTitle: { color: CourseColors.text, fontSize: 18, fontWeight: '900' },
  saveButton: { minHeight: 50, backgroundColor: CourseColors.primary, borderRadius: 14, paddingVertical: 13, alignItems: 'center', justifyContent: 'center' }, saveText: { color: CourseColors.white, fontSize: 15, fontWeight: '900' }, disabled: { opacity: 0.55 }, savedBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: CourseColors.primarySoft, borderRadius: 12, padding: 12 }, savedIcon: { color: CourseColors.primary, fontWeight: '900' }, saved: { color: CourseColors.primaryDark, textAlign: 'center', fontWeight: '800', fontSize: 13 },
});
