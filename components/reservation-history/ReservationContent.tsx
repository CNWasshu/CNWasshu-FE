import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReservationCard } from '@/components/reservation-history/ReservationCard';
import { ReservationEmpty } from '@/components/reservation-history/ReservationEmpty';
import { ReservationError } from '@/components/reservation-history/ReservationError';
import { ReservationLoading } from '@/components/reservation-history/ReservationLoading';
import { PageHero } from '@/components/layout';
import { PAGE_LAYOUT } from '@/constants/layout';
import type { ReservationResponse } from '@/types/reservation';

interface ReservationContentProps {
  reservations: ReservationResponse[];
  loading: boolean;
  errorMessage: string | null;

  onPress: (
    reservation: ReservationResponse
  ) => void;

  onCancel: (
    reservation: ReservationResponse
  ) => void;

  onRetry: () => void;
}

export function ReservationContent({
  reservations,
  loading,
  errorMessage,
  onPress,
  onCancel,
  onRetry,
}: ReservationContentProps) {
  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <PageHero
          description="예정된 예약을 확인해보세요."
          showBack
          title="예약 내역"
        />

        <View style={styles.screen}>
          <Text style={styles.countSummary}>
            총 {reservations.length}건의 예약이 있어요
          </Text>

          {loading ? (
            <ReservationLoading />
          ) : errorMessage ? (
            <ReservationError
              message={errorMessage}
              onRetry={onRetry}
            />
          ) : reservations.length ===
            0 ? (
            <ReservationEmpty />
          ) : (
            <View style={styles.grid}>
              {reservations.map(
                (reservation) => (
                  <View
                    key={
                      reservation.reservationId
                    }
                    style={
                      styles.cardWrapper
                    }
                  >
                    <ReservationCard
                      reservation={
                        reservation
                      }
                      onPress={() =>
                        onPress(
                          reservation
                        )
                      }
                      onCancel={() =>
                        onCancel(
                          reservation
                        )
                      }
                    />
                  </View>
                )
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F0',
  },

  scroll: {
    flex: 1,
    backgroundColor: '#FAF7F0',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FAF7F0',
  },

  screen: {
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 30,
    backgroundColor: '#FAF7F0',
  },

  countSummary: {
    color: '#5F5139',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },

  cardWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
});
