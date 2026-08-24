import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { RestaurantDetailResponse } from '@/types/restaurant';

type RestaurantDetailInfoProps = {
  restaurant: RestaurantDetailResponse;
};

export function RestaurantDetailInfo({
  restaurant,
}: RestaurantDetailInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        맛집 정보
      </Text>

      <View style={styles.grid}>
        <InfoItem
          label="주소"
          value={restaurant.address}
        />

        <InfoItem
          label="전화번호"
          value={restaurant.phone}
        />

        <InfoItem
          label="운영시간"
          value={formatOperatingTime(restaurant)}
        />

        <InfoItem
          label="영업 상태"
          value={formatStatus(restaurant.status)}
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
  restaurant: RestaurantDetailResponse
) {
  const start =
    restaurant.operatingStartTime?.slice(0, 5);

  const end =
    restaurant.operatingEndTime?.slice(0, 5);

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

function formatStatus(
  status: RestaurantDetailResponse['status']
) {
  switch (status) {
    case 'OPEN':
      return '영업 중';

    case 'CLOSED':
      return '영업 종료';

    default:
      return '정보 없음';
  }
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