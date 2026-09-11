import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ActivityDetailResponse } from '@/types/activity';

interface ReservationActivityCardProps {
  activity: ActivityDetailResponse;
}

function formatTime(
  time: string | null
) {
  return time?.slice(0, 5) ?? '-';
}

function formatDuration(
  duration: number | null
) {
  if (!duration) {
    return '-';
  }

  const hours = Math.floor(
    duration / 60
  );
  const minutes = duration % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  if (minutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${minutes}분`;
}

export function ReservationActivityCard({
  activity,
}: ReservationActivityCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.tags}>
        <View style={styles.regionTag}>
          <Text style={styles.regionTagText}>
            {activity.regionName}
          </Text>
        </View>

        <View style={styles.categoryTag}>
          <Text
            style={styles.categoryTagText}
          >
            {activity.categoryName}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>
        {activity.title}
      </Text>

      <Text
        style={styles.address}
        numberOfLines={2}
      >
        {activity.address}
      </Text>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            운영 시간
          </Text>

          <Text style={styles.infoValue}>
            {formatTime(
              activity.operatingStartTime
            )}
            {' ~ '}
            {formatTime(
              activity.operatingEndTime
            )}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            소요 시간
          </Text>

          <Text style={styles.infoValue}>
            {formatDuration(
              activity.duration
            )}
          </Text>
        </View>
      </View>

      {activity.maxParticipants !==
        null && (
        <View style={styles.capacityNotice}>
          <Text
            style={styles.capacityText}
          >
            한 번에 최대{' '}
            {activity.maxParticipants}명까지
            예약할 수 있어요.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 22,
    backgroundColor: '#ffffff',

    shadowColor: '#503f22',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },

  regionTag: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#e7f4e2',
  },

  regionTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3F7045',
  },

  categoryTag: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#fff0d7',
  },

  categoryTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9b6500',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#262822',
  },

  address: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#777166',
  },

  infoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },

  infoItem: {
    flex: 1,
    padding: 11,
    borderRadius: 15,
    backgroundColor: '#FAF7F0',
    borderWidth: 1,
    borderColor: '#efe3ce',
  },

  infoLabel: {
    marginBottom: 4,
    fontSize: 13,
    fontWeight: '700',
    color: '#3F7045',
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4c4438',
  },

  capacityNotice: {
    marginTop: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 13,
    backgroundColor: '#eef9e9',
  },

  capacityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4c7442',
  },
});