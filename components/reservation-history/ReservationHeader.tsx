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
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          예약 관리
        </Text>
      </View>

      <Text style={styles.title}>
        예약 내역
      </Text>

      <Text style={styles.count}>
        예정된 예약 {count}건
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: -18,
    marginTop: -14,
    marginBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 28,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    backgroundColor: '#4f8f53',
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3f7d46',
  },

  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },

  count: {
    marginTop: 7,
    fontSize: 12,
    fontWeight: '700',
    color: '#e7f2e5',
  },
});