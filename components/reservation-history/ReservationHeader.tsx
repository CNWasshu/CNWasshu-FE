import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface ReservationHeaderProps {
  count: number;
}

export function ReservationHeader({
  count,
}: ReservationHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        예약 내역
      </Text>

      <Text style={styles.description}>
        예정된 예약을 확인해보세요.
      </Text>

      <Text style={styles.count}>
        총 {count}건의 예약이 있어요
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: -18,
    marginTop: -14,
    marginBottom: 22,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#3f8349',
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#ffffff',
  },

  description: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#ffffff',
  },

  count: {
    marginTop: 15,
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
});