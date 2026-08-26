import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';

type TimetableReservationSyncStatusProps = {
  conflictCount: number;
  error: string | null;
  invalidCount: number;
  isLoading: boolean;
  onRetry: () => void;
  syncedCount: number;
};

export function TimetableReservationSyncStatus({
  conflictCount,
  error,
  invalidCount,
  isLoading,
  onRetry,
  syncedCount,
}: TimetableReservationSyncStatusProps) {
  if (
    !isLoading &&
    !error &&
    syncedCount === 0 &&
    invalidCount === 0
  ) {
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
      ) : (
        <>
          <Text style={styles.success}>
            예약 완료 체험 {syncedCount}건을 일정에 반영했어요.
          </Text>
          {conflictCount > 0 ? (
            <Text
              accessibilityRole="alert"
              style={styles.warning}
            >
              기존 일정과 겹치는 예약이 {conflictCount}건 있어요. 저장 전에 시간을 확인해 주세요.
            </Text>
          ) : null}
          {invalidCount > 0 ? (
            <Text
              accessibilityRole="alert"
              style={styles.warning}
            >
              정보가 불완전한 예약 {invalidCount}건은 반영하지 못했어요.
            </Text>
          ) : null}
        </>
      )}
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
    fontSize: 12,
    lineHeight: 18,
  },
  message: {
    color: TIMETABLE_COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: TIMETABLE_COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  success: {
    color: '#356A3C',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  warning: {
    color: '#8A5A17',
    fontSize: 11,
    lineHeight: 17,
  },
});
