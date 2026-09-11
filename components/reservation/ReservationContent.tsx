import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ActivityDetailResponse } from '@/types/activity';
import type { ReservationTimeSlot } from '@/types/reservation';
import { PAGE_LAYOUT } from '@/constants/layout';
import { CourseColors } from '@/constants/course-colors';

import { ReservationActivityCard } from './ReservationActivityCard';
import { ReservationBottomBar } from './ReservationBottomBar';
import { ReservationCalendar } from './ReservationCalendar';
import { ReservationHeader } from './ReservationHeader';
import { ReservationOptions } from './ReservationOptions';
import { ReservationTimeSlots } from './ReservationTimeSlots';

interface ReservationContentProps {
  activity:
    | ActivityDetailResponse
    | null;

  activityLoading: boolean;
  activityErrorMessage:
    | string
    | null;

  reservationErrorMessage:
    | string
    | null;

  availableTimes:
    ReservationTimeSlot[];

  loadingTimes: boolean;
  creatingReservation: boolean;

  selectedDate: string | null;
  selectedTime: string | null;

  peopleCount: number;
  withChild: boolean;

  onBack: () => void;
  onRetry: () => void;
  onDateSelect: (
    date: string
  ) => void;
  onTimeSelect: (
    time: string
  ) => void;
  onPeopleCountChange: (
    count: number
  ) => void;
  onWithChildChange: (
    value: boolean
  ) => void;
  onSubmit: () => void;
}

export function ReservationContent({
  activity,
  activityLoading,
  activityErrorMessage,
  reservationErrorMessage,
  availableTimes,
  loadingTimes,
  creatingReservation,
  selectedDate,
  selectedTime,
  peopleCount,
  withChild,
  onBack,
  onRetry,
  onDateSelect,
  onTimeSelect,
  onPeopleCountChange,
  onWithChildChange,
  onSubmit,
}: ReservationContentProps) {
  if (activityLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.outer}>
        <View style={styles.center}>
          <ActivityIndicator
            color="#3f7d46"
          />

          <Text style={styles.loadingText}>
            체험 정보를 불러오는 중입니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (
    activityErrorMessage ||
    !activity
  ) {
    return (
      <SafeAreaView edges={['top']} style={styles.outer}>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {activityErrorMessage ??
              '체험 정보를 불러오지 못했습니다.'}
          </Text>

          <Pressable
            onPress={onRetry}
            style={styles.retry}
          >
            <Text style={styles.retryText}>
              다시 시도
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const canSubmit =
    selectedDate !== null &&
    selectedTime !== null;

  return (
    <SafeAreaView edges={['top']} style={styles.outer}>
      <View style={styles.app}>
        <ReservationHeader
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <ReservationActivityCard
            activity={activity}
          />

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              예약 날짜
            </Text>

            <Text style={styles.sectionSub}>
              방문할 날짜를 선택해 주세요.
            </Text>

            <ReservationCalendar
              selectedDate={selectedDate}
              startDate={
                activity.startDate
              }
              endDate={
                activity.endDate
              }
              todayAvailable={
                activity.todayAvailable
              }
              onDateSelect={
                onDateSelect
              }
            />
          </View>

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              예약 시간
            </Text>

            <Text style={styles.sectionSub}>
              예약 가능한 시간만 선택할
              수 있어요.
            </Text>

            {!selectedDate ? (
              <View style={styles.guide}>
                <Text
                  style={
                    styles.guideText
                  }
                >
                  날짜를 먼저 선택해 주세요.
                </Text>
              </View>
            ) : loadingTimes ? (
              <View
                style={styles.loadingBox}
              >
                <ActivityIndicator
                  color="#3f7d46"
                />

                <Text
                  style={
                    styles.loadingText
                  }
                >
                  예약 가능 시간을
                  확인하고 있어요.
                </Text>
              </View>
            ) : (
              <ReservationTimeSlots
                availableTimes={
                  availableTimes
                }
                selectedTime={
                  selectedTime
                }
                onTimeSelect={
                  onTimeSelect
                }
              />
            )}
          </View>

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              예약 정보
            </Text>

            <Text style={styles.sectionSub}>
              인원과 아이 동반 여부를
              선택해 주세요.
            </Text>

            <ReservationOptions
              peopleCount={
                peopleCount
              }
              maxParticipants={
                activity.maxParticipants
              }
              withChild={withChild}
              onPeopleCountChange={
                onPeopleCountChange
              }
              onWithChildChange={
                onWithChildChange
              }
            />
          </View>

          {reservationErrorMessage && (
            <View style={styles.errorBox}>
              <Text
                style={styles.errorText}
              >
                {reservationErrorMessage}
              </Text>
            </View>
          )}

          <View style={styles.space} />
        </ScrollView>

        <ReservationBottomBar
          canSubmit={canSubmit}
          creatingReservation={
            creatingReservation
          }
          onBack={onBack}
          onSubmit={onSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: CourseColors.background,
  },

  app: {
    flex: 1,
    width: '100%',
    backgroundColor: CourseColors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    paddingHorizontal: 18,
    paddingTop: PAGE_LAYOUT.sectionSpacing,
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#29251e',
  },

  sectionSub: {
    marginTop: 4,
    marginBottom: 11,
    fontSize: 13,
    color: '#817664',
  },

  guide: {
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 18,
    backgroundColor: '#f1e6d3',
  },

  guideText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#766749',
  },

  loadingBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },

  loadingText: {
    marginTop: 9,
    fontSize: 14,
    color: '#766749',
  },

  errorBox: {
    marginTop: 18,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fff1e6',
  },

  errorText: {
    fontSize: 14,
    color: '#a55731',
  },

  retry: {
    marginTop: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f1e6d3',
  },

  retryText: {
    fontWeight: '700',
    color: '#5d4a2a',
  },

  center: {
    flex: 1,
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fffaf1',
  },

  space: {
    height: 24,
  },
});
