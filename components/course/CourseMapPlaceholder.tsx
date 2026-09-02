import { CourseColors } from '@/constants/course-colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

export function CourseMapPlaceholder({ dayNo }: { dayNo?: number }) {
  return (
    <View accessibilityLabel="표시할 위치 정보가 없는 코스" style={styles.container}>
      <View style={styles.icon}>
        <Ionicons color={CourseColors.primary} name="location-outline" size={26} />
      </View>
      <Text style={styles.title}>{dayNo == null ? '이 코스에는 표시할 위치 정보가 없어요' : `Day ${dayNo}에는 지도에 표시할 위치 정보가 없어요`}</Text>
      <Text style={styles.description}>일정에 위치가 연결되면 지도와 이동 경로가 표시됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: CourseColors.background, borderColor: '#CAD8C8', borderRadius: 16, borderWidth: 1, gap: 8, justifyContent: 'center', minHeight: 170, padding: 20 },
  icon: { alignItems: 'center', backgroundColor: CourseColors.primarySoft, borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  title: { color: CourseColors.text, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  description: { color: CourseColors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
