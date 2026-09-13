import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ReservationResponse } from '@/types/reservation';

interface ReservationCardProps {
  reservation: ReservationResponse;
  onPress: () => void;
  onCancel: () => void;
}

export function ReservationCard({
  reservation,
  onPress,
  onCancel,
}: ReservationCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.top}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            예약 확정
          </Text>
        </View>

        <Text style={styles.date}>
          {formatDate(
            reservation.reservationDate
          )}
        </Text>

        <Text style={styles.time}>
          {formatTime(
            reservation.reservationTime
          )}
          {' ~ '}
          {formatTime(
            reservation.endTime
          )}
        </Text>
      </View>

      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {reservation.activityTitle}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            {reservation.peopleCount}명
          </Text>

          <View style={styles.dot} />

          <Text style={styles.metaText}>
            {reservation.withChild
              ? '아이 동반'
              : '아이 미동반'}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="예약 취소"
          style={styles.cancelButton}
          onPress={(event) => {
            event.stopPropagation();
            onCancel();
          }}
        >
          <Text style={styles.cancelButtonText}>
            예약 취소
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function formatDate(
  date: string
) {
  const [, month, day] =
    date.split('-');

  return `${Number(month)}월 ${Number(
    day
  )}일`;
}

function formatTime(
  time: string
) {
  return time.slice(0, 5);
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 18,
    backgroundColor: '#ffffff',
  },

  top: {
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 10,
    backgroundColor: '#e8f5e4',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#3F7045',
  },

  date: {
    marginTop: 9,
    fontSize: 16,
    fontWeight: '900',
    color: '#315e36',
  },

  time: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: '#527557',
  },

  content: {
    padding: 11,
  },

  title: {
    minHeight: 24,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: '#262822',
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 6,
  },

  metaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#766749',
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#c7bda9',
  },

  cancelButton: {
    minHeight: 32,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2c4bf',
    borderRadius: 10,
    backgroundColor: '#fff8f6',
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#a95050',
  },
});