import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { CourseColors } from '@/constants/course-colors';

// 초록 히어로 배경 위에 올려두는 왼쪽 위 뒤로가기 버튼.
// course/timetable 쪽에는 이 스타일(hero + headerShown:false)에 맞는
// 기존 뒤로가기 컴포넌트가 없어서 새로 만들었다 (mypage/notification 계열 공통 사용).
export function BackHeader() {
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel="뒤로 가기"
      accessibilityRole="button"
      onPress={() => router.back()}
      style={styles.button}>
      <Text style={styles.icon}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignSelf: 'flex-start',
  },
  icon: {
    color: CourseColors.white,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
});
