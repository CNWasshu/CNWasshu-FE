import { CourseListItem } from '@/components/course/CourseListItem';
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
        <View style={styles.heading}>
          <View><Text style={styles.title}>나의 코스</Text><Text style={styles.subtitle}>저장한 여행 코스를 확인해 보세요.</Text></View>
          <Pressable style={styles.aiButton} onPress={() => router.push('/course/ai')}><Text style={styles.aiButtonText}>AI 코스 추천 받기</Text></Pressable>
        </View>
        {loading ? <ActivityIndicator size="large" color="#2F80ED" style={styles.loading} /> : null}
        {!loading && error ? <View style={styles.state}><Text style={styles.error}>{error}</Text><Pressable onPress={() => void refetch()}><Text style={styles.retry}>다시 시도</Text></Pressable></View> : null}
        {!loading && !error && courses.length === 0 ? <View style={styles.state}><Text style={styles.emptyTitle}>아직 저장된 코스가 없어요.</Text><Text style={styles.subtitle}>AI 추천을 받거나 타임테이블에서 코스를 저장해 보세요.</Text></View> : null}
        {!loading && !error ? <View style={styles.list}>{courses.map((course) => <CourseListItem key={course.id} course={course} onPress={() => router.push(`/course/${course.id}`)} />)}</View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' }, container: { padding: 20, paddingBottom: 40, gap: 22 },
  heading: { gap: 16 }, title: { fontSize: 30, fontWeight: '900', color: '#111827' }, subtitle: { marginTop: 5, color: '#6B7280', lineHeight: 20 },
  aiButton: { backgroundColor: '#2F80ED', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }, aiButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  list: { gap: 12 }, loading: { marginTop: 50 }, state: { alignItems: 'center', padding: 30, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#374151' }, error: { color: '#B42318', textAlign: 'center' }, retry: { color: '#2F80ED', fontWeight: '800' },
});
