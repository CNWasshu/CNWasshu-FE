import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

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
      hitSlop={10}
      onPress={() => router.back()}
      style={styles.button}>
      <Ionicons color={CourseColors.white} name="arrow-back" size={28} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
