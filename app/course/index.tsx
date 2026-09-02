import { CourseListItem } from '@/components/course/CourseListItem';
import { CourseColors } from '@/constants/course-colors';
import { useCourses } from '@/hooks/useCourse';
import type { CourseSummary } from '@/types/course';
import { filterCourses, getTripStatus, sortCourses, type CourseFilter, type CourseSort } from '@/utils/course-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseListScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { courses, loading, error, refetch } = useCourses();
  const [filter, setFilter] = useState<CourseFilter>('ALL');
  const [sort, setSort] = useState<CourseSort>('NEAREST');
  const [sortOpen, setSortOpen] = useState(false);
  const singleColumn = width < 600;
  const filteredCourses = useMemo(() => filterCourses(courses, filter), [courses, filter]);
  const sortedCourses = useMemo(() => sortCourses(filteredCourses, sort), [filteredCourses, sort]);
  const currentCourses = useMemo(() => sortedCourses.filter((course) => getTripStatus(course).type !== 'PAST'), [sortedCourses]);
  const pastCourses = useMemo(() => sortedCourses.filter((course) => getTripStatus(course).type === 'PAST'), [sortedCourses]);

  useFocusEffect(useCallback(() => { void refetch(); }, [refetch]));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroTop}><Text style={styles.heroTitle}>코스</Text><Text style={styles.heroBadge}>저장 코스 / AI 추천</Text></View>
          <Text style={styles.heroHeadline}>나만의 코스를 관리해요</Text>
          <Text style={styles.heroDescription}>저장한 일정을 확인하고 새로운 AI 코스를 만들어보세요.</Text>
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
            <View style={styles.sectionHeading}><View style={styles.sectionTitleWrap}><Text style={styles.sectionTitle}>저장된 코스 <Text style={styles.sectionCount}>{courses.length}</Text></Text></View><Pressable accessibilityLabel="새 AI 추천 코스 만들기" style={({ pressed }) => [styles.smallAiButton, pressed && styles.smallAiButtonPressed]} onPress={() => router.push('/course/ai')}><Text style={styles.aiSparkle}>✦</Text><Text style={styles.smallAiText}>AI 코스</Text><Text style={styles.smallAiArrow}>＋</Text></Pressable></View>
            <View style={styles.controls}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                {FILTER_OPTIONS.map((option) => {
                  const selected = filter === option.value;
                  return <Pressable key={option.value} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={`${option.label} 코스 필터`} onPress={() => setFilter(option.value)} style={({ pressed }) => [styles.filterChip, selected && styles.filterChipSelected, pressed && styles.controlPressed]}>
                    {selected ? <Ionicons color={CourseColors.white} name="checkmark" size={14} /> : null}
                    <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>{option.label}</Text>
                  </Pressable>;
                })}
              </ScrollView>
              <View style={styles.sortWrap}>
                <Pressable accessibilityRole="button" accessibilityLabel={`정렬 기준, ${SORT_LABELS[sort]}`} accessibilityState={{ expanded: sortOpen }} onPress={() => setSortOpen((open) => !open)} style={({ pressed }) => [styles.sortButton, pressed && styles.controlPressed]}>
                  <Ionicons color={CourseColors.primaryDark} name="swap-vertical-outline" size={16} />
                  <Text style={styles.sortButtonText}>{SORT_LABELS[sort]}</Text>
                  <Ionicons color={CourseColors.muted} name={sortOpen ? 'chevron-up' : 'chevron-down'} size={14} />
                </Pressable>
                {sortOpen ? <View style={styles.sortMenu}>{SORT_OPTIONS.map((option) => <Pressable key={option.value} accessibilityRole="button" accessibilityState={{ selected: sort === option.value }} onPress={() => { setSort(option.value); setSortOpen(false); }} style={({ pressed }) => [styles.sortOption, sort === option.value && styles.sortOptionSelected, pressed && styles.controlPressed]}>
                  <Text style={[styles.sortOptionText, sort === option.value && styles.sortOptionTextSelected]}>{option.label}</Text>
                  {sort === option.value ? <Ionicons color={CourseColors.primary} name="checkmark" size={16} /> : null}
                </Pressable>)}</View> : null}
              </View>
            </View>
            {filteredCourses.length === 0 ? <FilteredEmptyState filter={filter} onAiPress={() => router.push('/course/ai')} /> : null}
            {filteredCourses.length > 0 && sort === 'NEAREST' ? <>
              {currentCourses.length > 0 ? <CourseSection title="여행 중 · 다가오는 여행" courses={currentCourses} singleColumn={singleColumn} onCoursePress={(id) => router.push(`/course/${id}`)} /> : null}
              {pastCourses.length > 0 ? <CourseSection title="지난 여행" courses={pastCourses} singleColumn={singleColumn} onCoursePress={(id) => router.push(`/course/${id}`)} muted /> : null}
            </> : null}
            {filteredCourses.length > 0 && sort !== 'NEAREST' ? <View style={styles.list}>{sortedCourses.map((course) => <CourseListItem key={course.id} course={course} onPress={() => router.push(`/course/${course.id}`)} singleColumn={singleColumn} />)}</View> : null}
          </View> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const FILTER_OPTIONS: { label: string; value: CourseFilter }[] = [{ label: '전체', value: 'ALL' }, { label: 'AI 추천', value: 'AI' }, { label: '직접 만든 코스', value: 'USER' }];
const SORT_OPTIONS: { label: string; value: CourseSort }[] = [{ label: '가까운 여행순', value: 'NEAREST' }, { label: '시작일 최신순', value: 'LATEST_START' }, { label: '이름순', value: 'NAME' }];
const SORT_LABELS = Object.fromEntries(SORT_OPTIONS.map((option) => [option.value, option.label])) as Record<CourseSort, string>;

function CourseSection({ title, courses, singleColumn, onCoursePress, muted = false }: { title: string; courses: CourseSummary[]; singleColumn: boolean; onCoursePress: (id: number) => void; muted?: boolean }) {
  return <View style={styles.courseGroup}>
    <View style={styles.groupHeading}><Text style={[styles.groupTitle, muted && styles.groupTitleMuted]}>{title}</Text><Text style={styles.groupCount}>{courses.length}</Text></View>
    <View style={styles.list}>{courses.map((course) => <CourseListItem key={course.id} course={course} onPress={() => onCoursePress(course.id)} singleColumn={singleColumn} />)}</View>
  </View>;
}

function FilteredEmptyState({ filter, onAiPress }: { filter: CourseFilter; onAiPress: () => void }) {
  const isAi = filter === 'AI';
  return <View style={styles.filteredEmpty}>
    <Ionicons color={CourseColors.primary} name={isAi ? 'sparkles-outline' : 'map-outline'} size={25} />
    <Text style={styles.filteredEmptyTitle}>{isAi ? '아직 AI 추천 코스가 없어요' : '아직 직접 만든 코스가 없어요'}</Text>
    <Text style={styles.filteredEmptyDescription}>{isAi ? 'AI에게 여행 코스를 추천받아보세요.' : '타임테이블에서 나만의 코스를 저장해보세요.'}</Text>
    {isAi ? <Pressable accessibilityRole="button" onPress={onAiPress} style={({ pressed }) => [styles.filteredEmptyAction, pressed && styles.controlPressed]}><Text style={styles.filteredEmptyActionText}>AI 코스 추천 받기</Text></Pressable> : null}
  </View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.primary }, container: { flexGrow: 1, backgroundColor: CourseColors.background, paddingBottom: 96 },
  hero: { backgroundColor: CourseColors.primary, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 26, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, gap: 7 }, heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 }, heroTitle: { color: CourseColors.white, fontSize: 27, fontWeight: '900' }, heroBadge: { color: '#E6F3E3', fontSize: 11, fontWeight: '700', borderLeftWidth: 1, borderLeftColor: '#8DB392', paddingLeft: 10 }, heroHeadline: { color: CourseColors.white, fontSize: 19, fontWeight: '900', marginTop: 3 }, heroDescription: { color: '#E4EFE1', fontSize: 13, lineHeight: 19, maxWidth: 520 },
  body: { width: '100%', maxWidth: 820, alignSelf: 'center', paddingHorizontal: 14, marginTop: 20 }, loadingCard: { minHeight: 180, backgroundColor: CourseColors.white, borderRadius: 22, borderWidth: 1, borderColor: CourseColors.border, alignItems: 'center', justifyContent: 'center', gap: 13 }, loadingText: { color: CourseColors.muted },
  stateCard: { backgroundColor: CourseColors.white, borderRadius: 26, borderWidth: 1, borderColor: CourseColors.border, paddingHorizontal: 24, paddingVertical: 31, alignItems: 'center', gap: 14, shadowColor: '#5A4932', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 }, leafIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: CourseColors.primarySoft, alignItems: 'center', justifyContent: 'center' }, leaf: { fontSize: 31, color: CourseColors.primary, transform: [{ rotate: '-25deg' }] }, stateIcon: { width: 38, height: 38, borderRadius: 19, textAlign: 'center', paddingTop: 8, backgroundColor: '#FFF1ED', color: CourseColors.error, fontWeight: '900', overflow: 'hidden' }, emptyTitle: { fontSize: 20, fontWeight: '900', color: CourseColors.text, textAlign: 'center' }, stateDescription: { color: CourseColors.muted, textAlign: 'center', lineHeight: 22 }, error: { color: CourseColors.error, textAlign: 'center' }, actions: { alignSelf: 'stretch', gap: 10, marginTop: 6 },
  outlineButton: { minHeight: 50, borderWidth: 1, borderColor: CourseColors.primary, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }, outlineButtonText: { color: CourseColors.primary, fontWeight: '900' }, aiButton: { minHeight: 52, backgroundColor: CourseColors.primary, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, aiButtonText: { color: CourseColors.white, fontWeight: '900', fontSize: 15 }, aiArrow: { color: CourseColors.white, fontSize: 18, fontWeight: '900' },
  listSection: { gap: 13 }, sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 2 }, sectionTitleWrap: { flexShrink: 1 }, sectionTitle: { color: CourseColors.text, fontSize: 21, fontWeight: '900' }, sectionCount: { color: CourseColors.primary, fontSize: 17, fontWeight: '900' }, smallAiButton: { alignItems: 'center', backgroundColor: CourseColors.primary, borderRadius: 14, flexDirection: 'row', gap: 5, minHeight: 44, paddingHorizontal: 11 }, smallAiButtonPressed: { backgroundColor: CourseColors.primaryDark, opacity: 0.9 }, aiSparkle: { color: '#EAF5E7', fontSize: 11, fontWeight: '900' }, smallAiText: { color: CourseColors.white, fontWeight: '900', fontSize: 12 }, smallAiArrow: { color: CourseColors.white, fontWeight: '700', fontSize: 16 },
  controls: { gap: 9 }, filterRow: { gap: 7, paddingRight: 4 }, filterChip: { alignItems: 'center', backgroundColor: '#FFFCF7', borderColor: CourseColors.border, borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 4, minHeight: 38, paddingHorizontal: 13 }, filterChipSelected: { backgroundColor: CourseColors.primary, borderColor: CourseColors.primary }, filterChipText: { color: CourseColors.text, fontSize: 12, fontWeight: '800' }, filterChipTextSelected: { color: CourseColors.white }, controlPressed: { opacity: 0.72 }, sortWrap: { alignItems: 'flex-end', position: 'relative', zIndex: 2 }, sortButton: { alignItems: 'center', alignSelf: 'flex-end', backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 12, borderWidth: 1, flexDirection: 'row', gap: 5, minHeight: 40, paddingHorizontal: 11 }, sortButtonText: { color: CourseColors.primaryDark, fontSize: 12, fontWeight: '800' }, sortMenu: { backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, marginTop: 5, minWidth: 158, overflow: 'hidden' }, sortOption: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 42, paddingHorizontal: 12 }, sortOptionSelected: { backgroundColor: CourseColors.primarySoft }, sortOptionText: { color: CourseColors.text, fontSize: 12, fontWeight: '700' }, sortOptionTextSelected: { color: CourseColors.primaryDark, fontWeight: '900' },
  courseGroup: { gap: 8 }, groupHeading: { alignItems: 'center', flexDirection: 'row', gap: 6, paddingHorizontal: 2 }, groupTitle: { color: CourseColors.text, fontSize: 15, fontWeight: '900' }, groupTitleMuted: { color: '#71695D' }, groupCount: { color: CourseColors.muted, fontSize: 12, fontWeight: '800' }, list: { alignItems: 'stretch', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filteredEmpty: { alignItems: 'center', backgroundColor: '#FFFCF7', borderColor: CourseColors.border, borderRadius: 16, borderWidth: 1, gap: 7, paddingHorizontal: 18, paddingVertical: 24 }, filteredEmptyTitle: { color: CourseColors.text, fontSize: 16, fontWeight: '900', marginTop: 2, textAlign: 'center' }, filteredEmptyDescription: { color: CourseColors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' }, filteredEmptyAction: { borderColor: CourseColors.primary, borderRadius: 12, borderWidth: 1, justifyContent: 'center', marginTop: 5, minHeight: 44, paddingHorizontal: 15 }, filteredEmptyActionText: { color: CourseColors.primaryDark, fontSize: 13, fontWeight: '900' },
});
