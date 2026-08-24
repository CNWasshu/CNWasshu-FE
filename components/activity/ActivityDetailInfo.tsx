import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ActivityDetailResponse } from '@/types/activity';

type ActivityDetailInfoProps = {
  activity: ActivityDetailResponse;
};

export function ActivityDetailInfo({
  activity,
}: ActivityDetailInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        체험 정보
      </Text>

      <View style={styles.grid}>
        <InfoItem
          label="주소"
          value={activity.address}
        />

        <InfoItem
          label="전화번호"
          value={activity.phone}
        />

        <InfoItem
          label="운영시간"
          value={formatOperatingTime(activity)}
        />

        <InfoItem
          label="소요시간"
          value={
            activity.duration != null
              ? `${activity.duration}분`
              : null
          }
        />

        <InfoItem
          label="당일 체험"
          value={
            activity.todayAvailable == null
              ? null
              : activity.todayAvailable
                ? '가능'
                : '불가'
          }
        />

        <InfoItem
          label="예약"
          value={
            activity.reservationRequired == null
              ? null
              : activity.reservationRequired
                ? '예약 필요'
                : '예약 없이 이용 가능'
          }
        />
      </View>
    </View>
  );
}

type InfoItemProps = {
  label: string;
  value: string | null;
};

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value || '정보 없음'}
      </Text>
    </View>
  );
}

function formatOperatingTime(
  activity: ActivityDetailResponse
) {
  const start =
    activity.operatingStartTime?.slice(0, 5);

  const end =
    activity.operatingEndTime?.slice(0, 5);

  if (start && end) {
    return `${start} ~ ${end}`;
  }

  if (start) {
    return `${start}부터`;
  }

  if (end) {
    return `${end}까지`;
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
  },

  sectionTitle: {
    color: '#29251E',
    fontSize: 18,
    fontWeight: '900',
  },

  grid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  infoItem: {
    width: '48%',
    minHeight: 88,
    padding: 13,
    borderWidth: 1,
    borderColor: '#EFE3CE',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  label: {
    color: '#8A7A61',
    fontSize: 10,
    fontWeight: '800',
  },

  value: {
    marginTop: 7,
    color: '#29251E',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
});