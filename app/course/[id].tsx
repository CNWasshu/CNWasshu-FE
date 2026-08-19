import { CourseMap } from '@/components/course/CourseMap';
import { CourseSchedule } from '@/components/course/CourseSchedule';
import { useCourse } from '@/hooks/useCourse';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(id) ? id[0] : id;
  const parsedId = rawId && /^\d+$/.test(rawId) ? Number(rawId) : null;
  const { course, loading, error, refetch } = useCourse(parsedId);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: '코스 상세', headerBackTitle: '목록' }} />
      {loading ? <ActivityIndicator size="large" color="#2F80ED" style={styles.loading} /> : null}
      {!loading && error ? <View style={styles.state}><Text style={styles.error}>{error}</Text><Pressable onPress={() => void refetch()}><Text style={styles.retry}>다시 시도</Text></Pressable></View> : null}
      {!loading && course ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View><Text style={styles.title}>{course.courseName}</Text><Text style={styles.date}>{course.startDate} ~ {course.endDate}</Text><Text style={styles.meta}>{course.peopleCount}명 · {course.courseType === 'AI' ? 'AI 추천 코스' : '내가 만든 코스'}</Text></View>
          <CourseMap items={course.items} />
          <CourseSchedule items={course.items} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' }, container: { padding: 20, paddingBottom: 40, gap: 24 },
  title: { fontSize: 27, fontWeight: '900', color: '#111827' }, date: { color: '#4B5563', marginTop: 8, fontSize: 16 }, meta: { color: '#6B7280', marginTop: 5 },
  loading: { marginTop: 80 }, state: { alignItems: 'center', padding: 30, gap: 12 }, error: { color: '#B42318', textAlign: 'center' }, retry: { color: '#2F80ED', fontWeight: '800' },
});
