import { StyleSheet, Text, View } from 'react-native';

export function TimetableHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.brand}>장바구니</Text>
        <Text style={styles.eyebrow}>내 손안의 농촌 여행</Text>
      </View>
      <Text style={styles.title}>타임테이블 빌더</Text>
      <Text style={styles.description}>
        출발일과 도착일을 정하고, 시간대별로 자유 일정 또는 담아둔 체험을 배치해보세요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#68A653',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 22,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  description: {
    color: '#F2F8EF',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  eyebrow: {
    color: '#F1F8ED',
    fontSize: 12,
    fontWeight: '700',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginTop: 5,
  },
});
