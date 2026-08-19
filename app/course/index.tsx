import { CourseListItem } from '@/components/course/CourseListItem';
import { CourseColors } from '@/constants/course-colors';
import { useCourses } from '@/hooks/useCourse';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseListScreen() {
  const router = useRouter();
  const { courses, loading, error, refetch } = useCourses();

  useFocusEffect(useCallback(() => { void refetch(); }, [refetch]));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroTop}><Text style={styles.heroTitle}>코스</Text><Text style={styles.heroBadge}>저장 코스 / AI 추천</Text></View>
          <Text style={styles.heroHeadline}>나만의 코스를 관리해요</Text>
          <Text style={styles.heroDescription}>저장한 타임테이블을 불러오거나,{`\n`}조건을 입력해 AI 코스 추천을 받을 수 있어요.</Text>
        </View>
        <View style={styles.body}>
          {loading ? <View style={styles.loadingCard}><ActivityIndicator size="large" color={CourseColors.primary} /><Text style={styles.loadingText}>저장된 코스를 불러오고 있어요.</Text></View> : null}
          {!loading && error ? <View style={styles.stateCard}><Text style={styles.stateIcon}>!</Text><Text style={styles.error}>{error}</Text><Pressable style={styles.outlineButton} onPress={() => void refetch()}><Text style={styles.outlineButtonText}>다시 시도</Text></Pressable></View> : null}
          {!loading && !error && courses.length === 0 ? <View style={styles.stateCard}>
            <View style={styles.leafIcon}><Text style={styles.leaf}>♧</Text></View>
            <Text style={styles.emptyTitle}>코스를 어떻게 시작할까요?</Text>
            <Text style={styles.stateDescription}>내가 짠 타임테이블 코스와{`\n`}AI 추천 코스를 저장해두고{`\n`}필요할 때 불러올 수 있습니다.</Text>
            <View style={styles.actions}>
              <Pressable style={styles.outlineButton} onPress={() => void refetch()}><Text style={styles.outlineButtonText}>저장된 코스 불러오기</Text></Pressable>
              <Pressable style={styles.aiButton} onPress={() => router.push('/course/ai')}><Text style={styles.aiButtonText}>AI 코스 추천 받기</Text><Text style={styles.aiArrow}>→</Text></Pressable>
            </View>
          </View> : null}
          {!loading && !error && courses.length > 0 ? <View style={styles.listSection}>
            <View style={styles.sectionHeading}><View><Text style={styles.sectionEyebrow}>MY COURSE</Text><Text style={styles.sectionTitle}>저장된 코스</Text></View><Pressable style={styles.smallAiButton} onPress={() => router.push('/course/ai')}><Text style={styles.smallAiText}>AI 추천 +</Text></Pressable></View>
            <View style={styles.list}>{courses.map((course) => <CourseListItem key={course.id} course={course} onPress={() => router.push(`/course/${course.id}`)} />)}</View>
          </View> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.primary }, container: { flexGrow: 1, backgroundColor: CourseColors.background, paddingBottom: 44 },
  hero: { backgroundColor: CourseColors.primary, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 42, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, gap: 12 }, heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 }, heroTitle: { color: CourseColors.white, fontSize: 30, fontWeight: '900' }, heroBadge: { color: '#E6F3E3', fontSize: 12, fontWeight: '700', borderLeftWidth: 1, borderLeftColor: '#8DB392', paddingLeft: 10 }, heroHeadline: { color: CourseColors.white, fontSize: 22, fontWeight: '900', marginTop: 7 }, heroDescription: { color: '#E4EFE1', fontSize: 14, lineHeight: 22 },
  body: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 18, marginTop: -18 }, loadingCard: { minHeight: 220, backgroundColor: CourseColors.white, borderRadius: 24, borderWidth: 1, borderColor: CourseColors.border, alignItems: 'center', justifyContent: 'center', gap: 13 }, loadingText: { color: CourseColors.muted },
  stateCard: { backgroundColor: CourseColors.white, borderRadius: 26, borderWidth: 1, borderColor: CourseColors.border, paddingHorizontal: 24, paddingVertical: 31, alignItems: 'center', gap: 14, shadowColor: '#5A4932', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 }, leafIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: CourseColors.primarySoft, alignItems: 'center', justifyContent: 'center' }, leaf: { fontSize: 31, color: CourseColors.primary, transform: [{ rotate: '-25deg' }] }, stateIcon: { width: 38, height: 38, borderRadius: 19, textAlign: 'center', paddingTop: 8, backgroundColor: '#FFF1ED', color: CourseColors.error, fontWeight: '900', overflow: 'hidden' }, emptyTitle: { fontSize: 20, fontWeight: '900', color: CourseColors.text, textAlign: 'center' }, stateDescription: { color: CourseColors.muted, textAlign: 'center', lineHeight: 22 }, error: { color: CourseColors.error, textAlign: 'center' }, actions: { alignSelf: 'stretch', gap: 10, marginTop: 6 },
  outlineButton: { minHeight: 50, borderWidth: 1, borderColor: CourseColors.primary, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }, outlineButtonText: { color: CourseColors.primary, fontWeight: '900' }, aiButton: { minHeight: 52, backgroundColor: CourseColors.primary, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, aiButtonText: { color: CourseColors.white, fontWeight: '900', fontSize: 15 }, aiArrow: { color: CourseColors.white, fontSize: 18, fontWeight: '900' },
  listSection: { gap: 16 }, sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 3 }, sectionEyebrow: { color: CourseColors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 }, sectionTitle: { color: CourseColors.text, fontSize: 22, fontWeight: '900', marginTop: 3 }, smallAiButton: { backgroundColor: CourseColors.primarySoft, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 9 }, smallAiText: { color: CourseColors.primaryDark, fontWeight: '900', fontSize: 13 }, list: { gap: 13 },
});
