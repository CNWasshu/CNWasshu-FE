import { courseApi, getCourseErrorMessage } from '@/api/courseApi';
import { BackHeader } from '@/components/common/BackHeader';
import { CourseMap } from '@/components/course/CourseMap';
import { CourseSchedule } from '@/components/course/CourseSchedule';
import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';
import { useCourse } from '@/hooks/useCourse';
import { getAccessToken } from '@/utils/auth';
import { shareCourse } from '@/utils/courseShare';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= PAGE_LAYOUT.desktopNavigationBreakpoint;
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(id) ? id[0] : id;
  const parsedId = rawId && /^\d+$/.test(rawId) ? Number(rawId) : null;
  const { course, loading, error, refetch } = useCourse(parsedId);
  const [deleting, setDeleting] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!course || sharing) return;
    setSharing(true);
    try {
      const result = await shareCourse(course);
      if (result === 'COPIED') Alert.alert('공유 텍스트를 복사했어요', '원하는 곳에 붙여넣어 공유해 주세요.');
    } catch {
      Alert.alert('공유할 수 없습니다', '잠시 후 다시 시도해 주세요.');
    } finally {
      setSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!course || deleting) return;
    setDeleting(true);
    try {
      const accessToken = await getAccessToken();
      await courseApi.deleteCourse(course.id, accessToken ?? '');
      router.replace('/(tabs)/course');
    } catch (deleteError) {
      Alert.alert('코스를 삭제하지 못했어요', getCourseErrorMessage(deleteError));
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (!course || deleting) return;
    const message = `'${course.courseName}' 코스를 삭제할까요? 삭제한 코스는 다시 확인할 수 없습니다.`;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(message)) void handleDelete();
      return;
    }
    Alert.alert('코스 삭제', message, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => void handleDelete() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      {loading ? <View style={styles.loading}><ActivityIndicator size="large" color={CourseColors.primary} /><Text style={styles.stateTitle}>코스를 불러오고 있어요</Text><Text style={styles.stateDescription}>저장된 지도와 일정을 준비하고 있습니다.</Text></View> : null}
      {!loading && error ? <View style={styles.state}><Ionicons color={CourseColors.error} name="alert-circle-outline" size={32} /><Text style={styles.stateTitle}>코스를 불러오지 못했어요</Text><Text style={styles.stateDescription}>{error}</Text><Pressable accessibilityRole="button" style={styles.retryButton} onPress={() => void refetch()}><Text style={styles.retry}>다시 시도</Text></Pressable></View> : null}
      {!loading && course ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={[styles.hero, isDesktopWeb && styles.heroDesktop]}>
            <View style={styles.detailHeader}>
              <BackHeader />
              <Text style={styles.detailHeaderTitle}>코스 상세</Text>
            </View>
            <Text style={styles.typeBadge}>{course.courseType === 'AI' ? 'AI 추천 코스' : '내가 만든 코스'}</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{course.courseName}</Text>
              <View style={styles.courseActions}>
                <Pressable accessibilityLabel="코스 공유하기" accessibilityRole="button" disabled={sharing} hitSlop={8} onPress={() => void handleShare()} style={({ pressed }) => [styles.actionButton, (pressed || sharing) && styles.actionButtonPressed]}>
                  <Ionicons color={CourseColors.white} name="share-social-outline" size={21} />
                </Pressable>
                <Pressable accessibilityLabel="코스 삭제하기" accessibilityRole="button" disabled={deleting} hitSlop={8} onPress={confirmDelete} style={({ pressed }) => [styles.actionButton, styles.deleteButton, (pressed || deleting) && styles.actionButtonPressed]}>
                  <Ionicons color="#FFE5E0" name="trash-outline" size={20} />
                </Pressable>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}><Ionicons color="#E2EFE0" name="calendar-outline" size={16} /><Text style={styles.summaryText}>{course.startDate} ~ {course.endDate}</Text></View>
              <View style={styles.summaryItem}><Ionicons color="#E2EFE0" name="people-outline" size={16} /><Text style={styles.summaryText}>{course.peopleCount}명</Text></View>
              <View style={styles.summaryItem}><Ionicons color="#E2EFE0" name="list-outline" size={16} /><Text style={styles.summaryText}>일정 {course.items.length}개</Text></View>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.mapSection}><View style={styles.sectionHeading}><Ionicons color={CourseColors.primary} name="map-outline" size={20} /><Text style={styles.sectionTitle}>코스 지도</Text></View><CourseMap items={course.items} /></View>
            <View style={styles.scheduleSection}><View style={styles.sectionHeading}><Ionicons color={CourseColors.primary} name="list-outline" size={20} /><Text style={styles.sectionTitle}>여행 일정</Text></View><CourseSchedule enableDayNavigation items={course.items} /></View>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.background }, container: { paddingBottom: 46 },
  hero: { backgroundColor: CourseColors.hero, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 26, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, gap: 10, width: '100%' }, heroDesktop: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, minHeight: 168, paddingBottom: 30, paddingHorizontal: 24, paddingTop: 24 }, detailHeader: { alignItems: 'center', flexDirection: 'row', gap: 10 }, detailHeaderTitle: { color: CourseColors.white, fontSize: 18, fontWeight: '800' }, typeBadge: { alignSelf: 'flex-start', color: CourseColors.primaryDark, backgroundColor: '#E9F4E6', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4, fontWeight: '800', fontSize: 12, overflow: 'hidden' }, titleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 12 }, title: { color: CourseColors.white, flex: 1, fontSize: 25, fontWeight: '900', lineHeight: 32 }, summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, summaryItem: { alignItems: 'center', flexDirection: 'row', gap: 5 }, summaryText: { color: '#F4FAF2', fontSize: 12, fontWeight: '700' },
  content: { width: '100%', maxWidth: PAGE_LAYOUT.desktopMaxWidth, alignSelf: 'center', paddingHorizontal: 16, marginTop: 16, gap: 22 }, mapSection: { backgroundColor: CourseColors.white, borderRadius: 18, borderWidth: 1, borderColor: CourseColors.border, padding: 15, gap: 13 }, scheduleSection: { gap: 13 }, sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 }, sectionTitle: { color: CourseColors.text, fontSize: 19, fontWeight: '900' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 28 }, state: { alignItems: 'center', justifyContent: 'center', padding: 30, gap: 9 }, stateTitle: { color: CourseColors.text, fontSize: 16, fontWeight: '900', textAlign: 'center' }, stateDescription: { color: CourseColors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' }, retryButton: { minHeight: 44, borderWidth: 1, borderColor: CourseColors.primary, borderRadius: 12, justifyContent: 'center', marginTop: 5, paddingHorizontal: 20 }, retry: { color: CourseColors.primary, fontSize: 13, fontWeight: '900' },
  courseActions: { flexDirection: 'row', flexShrink: 0, gap: 8 }, actionButton: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.28)', borderRadius: 12, borderWidth: 1, height: 42, justifyContent: 'center', width: 42 }, deleteButton: { backgroundColor: 'rgba(119,37,28,0.22)', borderColor: 'rgba(255,213,207,0.35)' }, actionButtonPressed: { opacity: 0.55 },
});
