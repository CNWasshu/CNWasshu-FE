import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type ActivityDetailActionsProps = {
  isBookmarked: boolean;
  reservationRequired: boolean | null;

  onBookmarkPress: () => void;
  onReservationPress: () => void;
};

export function ActivityDetailActions({
  isBookmarked,
  reservationRequired,
  onBookmarkPress,
  onReservationPress,
}: ActivityDetailActionsProps) {
  const canReserve =
    reservationRequired === true;

  return (
    <View style={styles.container}>
      {canReserve && (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            예약이 필요한 체험이에요
          </Text>

          <Text style={styles.noticeDescription}>
            방문 전 원하는 날짜와 시간을 선택해 예약해 주세요.
          </Text>
        </View>
      )}

      {canReserve ? (
        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            style={styles.bookmarkButton}
            onPress={onBookmarkPress}
          >
            <Text style={styles.bookmarkText}>
              {isBookmarked
                ? '♥ 담았어요'
                : '♡ 담아두기'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={styles.reservationButton}
            onPress={onReservationPress}
          >
            <Text style={styles.reservationText}>
              예약하기
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          style={styles.fullBookmarkButton}
          onPress={onBookmarkPress}
        >
          <Text style={styles.bookmarkText}>
            {isBookmarked
              ? '♥ 담았어요'
              : '♡ 담아두기'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },

  notice: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#FFF0D7',
  },

  noticeTitle: {
    color: '#8B5700',
    fontSize: 13,
    fontWeight: '900',
  },

  noticeDescription: {
    marginTop: 5,
    color: '#8A6A35',
    fontSize: 12,
    lineHeight: 19,
  },

  buttonRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 9,
  },

  bookmarkButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#BFD9B7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  fullBookmarkButton: {
    width: '100%',
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#BFD9B7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  bookmarkText: {
    color: '#3F7D46',
    fontSize: 13,
    fontWeight: '900',
  },

  reservationButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#3F7D46',
  },

  reservationText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
