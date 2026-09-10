import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReservationCard } from '@/components/reservation-history/ReservationCard';
import { ReservationEmpty } from '@/components/reservation-history/ReservationEmpty';
import { ReservationError } from '@/components/reservation-history/ReservationError';
import { ReservationHeader } from '@/components/reservation-history/ReservationHeader';
import { ReservationLoading } from '@/components/reservation-history/ReservationLoading';
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
        <View style={styles.screen}>
          <ReservationHeader
            count={reservations.length}
          />

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
    backgroundColor: '#fffaf1',
  },

  scroll: {
    flex: 1,
    backgroundColor: '#fffaf1',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fffaf1',
  },

  screen: {
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 30,
    backgroundColor: '#fffaf1',
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
