import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';

type TimetableReservationSyncStatusProps = {
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
};

export function TimetableReservationSyncStatus({
  error,
  isLoading,
  onRetry,
}: TimetableReservationSyncStatusProps) {
  if (!isLoading && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.message}>
          여행 기간의 예약을 확인하고 있어요.
        </Text>
      ) : error ? (
        <>
          <Text
            accessibilityRole="alert"
            style={styles.error}
          >
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>
              다시 시도
            </Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#F4FAF2',
    borderColor: '#BDD7BF',
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 13,
  },
  error: {
    color: '#B84738',
    fontSize: 14,
    lineHeight: 20,
  },
  message: {
    color: TIMETABLE_COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: TIMETABLE_COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
