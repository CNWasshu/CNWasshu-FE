import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { TimetableTimeInput } from '@/components/timetable/TimetableTimeInput';
import type { SavedPlace, TimetableSchedule } from '@/types/timetable';
import {
  DAY_END_TIME,
  DAY_START_TIME,
  findOverlappingSchedule,
  validateScheduleInput,
} from '@/utils/timetable/time';

type ScheduleFormValue = Pick<TimetableSchedule, 'endTime' | 'startTime' | 'title'>;

type TimetableScheduleModalProps = {
  activitiesError: string | null;
  activitiesLoading: boolean;
  activities: SavedPlace[];
  dayLabel: string;
  onClearActivity: () => void;
  onBrowseActivities: () => void;
  onClose: () => void;
  onDelete?: () => void;
  onOpenActivities: () => void;
  onRequestReservation: () => void;
  onRetryActivities: () => void;
  onSelectActivity: (activityId: string) => void;
  onSubmit: (value: ScheduleFormValue) => void;
  schedule?: TimetableSchedule | null;
  schedules: TimetableSchedule[];
  selectedActivity: SavedPlace | null;
  selectedActivityId: string | null;
  visible: boolean;
};

const INITIAL_START_TIME = '09:00';
const INITIAL_END_TIME = '10:00';

function formatDuration(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) {
    return `약 ${minutes}분`;
  }

  return minutes === 0 ? `약 ${hours}시간` : `약 ${hours}시간 ${minutes}분`;
}

function addMinutes(time: string, minutesToAdd: number) {
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

function getDurationMinutes(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
}

function earlierTime(firstTime: string, secondTime: string) {
  return firstTime < secondTime ? firstTime : secondTime;
}

export function TimetableScheduleModal({
  activitiesError,
  activitiesLoading,
  activities,
  dayLabel,
  onClearActivity,
  onBrowseActivities,
  onClose,
  onDelete,
  onOpenActivities,
  onRequestReservation,
  onRetryActivities,
  onSelectActivity,
  onSubmit,
  schedule,
  schedules,
  selectedActivity,
  selectedActivityId,
  visible,
}: TimetableScheduleModalProps) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(INITIAL_START_TIME);
  const [endTime, setEndTime] = useState(INITIAL_END_TIME);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [isActivityListVisible, setIsActivityListVisible] = useState(false);
  const [reservationActivity, setReservationActivity] = useState<SavedPlace | null>(null);
  const isEditing = Boolean(schedule);
  const isPlaceSchedule = schedule?.kind === 'activity' || schedule?.kind === 'restaurant';
  const isActivityTitleLocked = Boolean(selectedActivity) || isPlaceSchedule;
  const activityOperatingType = selectedActivity?.operatingType
    ?? (isPlaceSchedule ? schedule.operatingType : null);
  const activityOperatingStartTime = activityOperatingType === 'hours'
    ? selectedActivity?.startTime ?? (isPlaceSchedule ? schedule.operatingStartTime : DAY_START_TIME)
    : DAY_START_TIME;
  const activityOperatingEndTime = activityOperatingType === 'hours'
    ? selectedActivity?.endTime ?? (isPlaceSchedule ? schedule.operatingEndTime : DAY_END_TIME)
    : DAY_END_TIME;
  const latestStartTime = addMinutes(activityOperatingEndTime, -5);
  const earliestEndTime = addMinutes(startTime, 5);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle(schedule?.title ?? '');
    setStartTime(schedule?.startTime ?? INITIAL_START_TIME);
    setEndTime(schedule?.endTime ?? INITIAL_END_TIME);
    setErrorMessage(null);
    setIsDeleteConfirmationVisible(false);
    setIsActivityListVisible(false);
    setReservationActivity(null);
  }, [schedule, visible]);

  useEffect(() => {
    if (!selectedActivity || !visible) {
      return;
    }

    setTitle(selectedActivity.title);
    setStartTime(
      selectedActivity.operatingType === 'always'
        ? INITIAL_START_TIME
        : selectedActivity.startTime
    );
    setEndTime(
      selectedActivity.operatingType === 'always'
        ? INITIAL_END_TIME
        : selectedActivity.endTime
    );
    setErrorMessage(null);
    setIsActivityListVisible(false);
  }, [selectedActivity, visible]);

  const handleSelectActivity = (activity: SavedPlace) => {
    if (activity.placeType === 'activity' && activity.requiresReservation) {
      setReservationActivity(activity);
      return;
    }

    onSelectActivity(activity.id);
  };

  const handleToggleActivityList = () => {
    setIsActivityListVisible((current) => {
      if (!current) {
        onOpenActivities();
      }

      return !current;
    });
  };

  const handleClearActivity = () => {
    onClearActivity();
    setTitle('');
    setStartTime(INITIAL_START_TIME);
    setEndTime(INITIAL_END_TIME);
    setErrorMessage(null);
    setIsActivityListVisible(true);
  };

  const handleChangeStartTime = (nextStartTime: string) => {
    if (nextStartTime >= endTime) {
      const currentDuration = Math.max(5, getDurationMinutes(startTime, endTime));
      const nextEndTime = earlierTime(
        addMinutes(nextStartTime, currentDuration),
        activityOperatingEndTime
      );
      setEndTime(nextEndTime);
    }

    setStartTime(nextStartTime);
    setErrorMessage(null);
  };

  const handleChangeEndTime = (nextEndTime: string) => {
    setEndTime(nextEndTime);
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    const validationMessage = validateScheduleInput(title, startTime, endTime);
    const activityTimeErrorMessage = activityOperatingType === 'hours'
      && (startTime < activityOperatingStartTime || endTime > activityOperatingEndTime)
      ? `체험 운영 시간 ${activityOperatingStartTime}~${activityOperatingEndTime} 안에서 선택해 주세요.`
      : null;
    const overlappingSchedule = validationMessage || activityTimeErrorMessage
      ? null
      : findOverlappingSchedule(
          schedules,
          { endTime, startTime },
          schedule?.id
        );
    const overlapErrorMessage = overlappingSchedule
      ? `${overlappingSchedule.startTime}~${overlappingSchedule.endTime} '${overlappingSchedule.title}' 일정과 시간이 겹칩니다.`
      : null;
    setErrorMessage(validationMessage ?? activityTimeErrorMessage ?? overlapErrorMessage);

    if (validationMessage || activityTimeErrorMessage || overlapErrorMessage) {
      return;
    }

    onSubmit({ endTime, startTime, title: title.trim() });
  };

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={!isActivityListVisible}
            showsVerticalScrollIndicator={false}>
            <View style={styles.headingRow}>
              <View style={styles.headingText}>
                <Text style={styles.title}>{isEditing ? '일정 수정' : '일정 추가'}</Text>
                <Text style={styles.description}>
                  {isEditing
                    ? `${dayLabel}의 일정을 수정합니다.`
                    : `${dayLabel}에 자유 일정 또는 장바구니에 담은 체험을 추가합니다.`}
                </Text>
              </View>
              <Pressable accessibilityLabel="닫기" accessibilityRole="button" onPress={onClose} style={styles.iconButton}>
                <Ionicons color={TIMETABLE_COLORS.secondaryText} name="close" size={18} />
              </Pressable>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>일정 제목</Text>
              <TextInput
                accessibilityLabel="일정 제목"
                editable={!isActivityTitleLocked}
                maxLength={40}
                onChangeText={setTitle}
                placeholder="예: 7시 출발, 점심 식사, 카페 휴식"
                placeholderTextColor="#A49A89"
                returnKeyType="done"
                style={styles.input}
                value={title}
              />

              <View style={styles.timeRow}>
                <TimetableTimeInput label="시작 시간" maximumTime={latestStartTime} minimumTime={activityOperatingStartTime} onChangeTime={handleChangeStartTime} value={startTime} />
                <TimetableTimeInput label="종료 시간" maximumTime={activityOperatingEndTime} minimumTime={earliestEndTime} onChangeTime={handleChangeEndTime} value={endTime} />
              </View>
              <Text style={styles.hint}>
                {activityOperatingType === 'always'
                  ? '상시 운영 체험은 원하는 시간을 선택할 수 있습니다.'
                  : activityOperatingType === 'hours'
                    ? `운영 시간 ${activityOperatingStartTime}~${activityOperatingEndTime} 안에서 원하는 시간을 선택할 수 있습니다.`
                    : '하루 안에서 5분 단위로 원하는 시간을 선택할 수 있습니다.'}
              </Text>
              {errorMessage ? <Text accessibilityRole="alert" style={styles.error}>{errorMessage}</Text> : null}
            </View>

            {!isEditing ? (
              <View style={styles.activitySection}>
                {!selectedActivity ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleToggleActivityList}
                    style={styles.activityToggle}>
                    <Text style={styles.activityToggleText}>체험 및 음식점 선택</Text>
                    <Ionicons color={TIMETABLE_COLORS.primary} name={isActivityListVisible ? 'chevron-up' : 'chevron-down'} size={18} />
                  </Pressable>
                ) : null}

                {selectedActivity && !isActivityListVisible ? (
                  <View style={styles.selectedActivitySummary}>
                    <View style={styles.activityIcon}>
                      <Text style={styles.activityEmoji}>{selectedActivity.icon}</Text>
                    </View>
                    <View style={styles.activityText}>
                      <Text style={styles.activityTitle}>{selectedActivity.title}</Text>
                      <Text style={styles.activityMetadata}>
                        {selectedActivity.location} · 운영 {selectedActivity.operatingType === 'always'
                          ? '상시 운영'
                          : `${selectedActivity.startTime}~${selectedActivity.endTime}`} · {formatDuration(startTime, endTime)}
                      </Text>
                      <Text style={styles.activityNotice}>
                        일정 추가하기를 누르면 이 {selectedActivity.placeType === 'activity' ? '체험' : '음식점'}이 타임테이블에 들어갑니다.
                      </Text>
                    </View>
                    <Pressable accessibilityRole="button" onPress={handleClearActivity}>
                      <Text style={styles.clearActivityText}>선택 취소</Text>
                    </Pressable>
                  </View>
                ) : null}

                {isActivityListVisible ? (
                  <View style={styles.activityListContainer}>
                    <Text style={styles.activityDescription}>
                      장바구니에 담아둔 체험과 음식점을 선택할 수 있어요. 더 담고 싶다면 홈에서 하트를 눌러주세요.
                    </Text>
                    <View style={styles.activityListHeading}>
                      <Text style={styles.activityCount}>담아둔 체험 및 음식점 {activities.length}개</Text>
                    </View>
                    {activitiesLoading ? (
                      <View accessibilityLiveRegion="polite" style={styles.activityStatus}>
                        <Text style={styles.activityStatusText}>담아둔 체험 및 음식점을 불러오고 있어요.</Text>
                      </View>
                    ) : activitiesError ? (
                      <View style={styles.activityStatus}>
                        <Text accessibilityRole="alert" style={styles.activityErrorText}>
                          {activitiesError}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          onPress={onRetryActivities}
                          style={styles.retryActivitiesButton}>
                          <Text style={styles.retryActivitiesButtonText}>다시 시도</Text>
                        </Pressable>
                      </View>
                    ) : activities.length === 0 ? (
                      <View style={styles.activityStatus}>
                        <Text style={styles.activityStatusText}>아직 담아둔 체험이나 음식점이 없습니다.</Text>
                      </View>
                    ) : (
                      <ScrollView
                        contentContainerStyle={styles.activityListContent}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        style={styles.activityList}>
                        {activities.map((activity) => (
                          <Pressable
                            accessibilityRole="button"
                            accessibilityState={{ selected: activity.id === selectedActivityId }}
                            key={activity.id}
                            onPress={() => handleSelectActivity(activity)}
                            style={styles.activityCard}>
                            <View style={styles.activityIcon}>
                              <Text style={styles.activityEmoji}>{activity.icon}</Text>
                            </View>
                            <View style={styles.activityText}>
                              <Text style={styles.activityTitle}>{activity.title}</Text>
                              <Text style={styles.activityMetadata}>
                                {activity.placeType === 'activity' ? '체험' : '음식점'} · {activity.location} · {activity.operatingType === 'always'
                                  ? '상시 운영'
                                  : `${activity.startTime}~${activity.endTime}`}
                                {' · '}{formatDuration(
                                  activity.operatingType === 'always' ? INITIAL_START_TIME : activity.startTime,
                                  activity.operatingType === 'always' ? INITIAL_END_TIME : activity.endTime
                                )}
                                {activity.requiresReservation ? ' · 예약 필요' : ''}
                              </Text>
                            </View>
                            <View style={styles.selectActivityButton}>
                              <Text style={styles.selectActivityButtonText}>선택</Text>
                            </View>
                          </Pressable>
                        ))}
                      </ScrollView>
                    )}
                    <Pressable
                      accessibilityHint="홈으로 이동해 다른 체험을 찾아봅니다."
                      accessibilityRole="button"
                      onPress={onBrowseActivities}
                      style={styles.moreActivitiesButton}>
                      <Text style={styles.moreActivitiesButtonText}>더 둘러보기</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            ) : null}

          </ScrollView>
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <View style={styles.buttonRow}>
              {isEditing && onDelete ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsDeleteConfirmationVisible(true)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </Pressable>
              ) : null}
              <Pressable accessibilityRole="button" onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>{isEditing ? '수정 완료' : '일정 추가하기'}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {isDeleteConfirmationVisible && onDelete ? (
          <View accessibilityViewIsModal style={styles.confirmationOverlay}>
            <Pressable
              accessibilityLabel="삭제 확인 창 닫기"
              onPress={() => setIsDeleteConfirmationVisible(false)}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.confirmationCard}>
              <View style={styles.warningIcon}>
                <Ionicons color="#B84738" name="trash-outline" size={22} />
              </View>
              <Text style={styles.confirmationTitle}>일정을 삭제할까요?</Text>
              <Text style={styles.confirmationDescription}>
                삭제한 일정은 다시 복구할 수 없습니다.
              </Text>
              <View style={styles.confirmationButtons}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsDeleteConfirmationVisible(false)}
                  style={styles.cancelButton}>
                  <Text numberOfLines={1} style={styles.cancelButtonText}>취소</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={onDelete} style={styles.confirmDeleteButton}>
                  <Text numberOfLines={1} style={styles.confirmDeleteButtonText}>삭제하기</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        {reservationActivity ? (
          <View accessibilityViewIsModal style={styles.confirmationOverlay}>
            <Pressable
              accessibilityLabel="예약 안내 창 닫기"
              onPress={() => setReservationActivity(null)}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.confirmationCard}>
              <View style={styles.reservationIcon}>
                <Ionicons color={TIMETABLE_COLORS.primary} name="calendar-outline" size={23} />
              </View>
              <Text style={styles.confirmationTitle}>예약이 필요한 체험입니다</Text>
              <Text style={styles.confirmationDescription}>
                {reservationActivity.title}은(는) 예약 페이지에서 시간을 확정한 후 일정에 추가할 수 있습니다.
              </Text>
              <View style={styles.confirmationButtons}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setReservationActivity(null)}
                  style={styles.cancelButton}>
                  <Text numberOfLines={1} style={styles.cancelButtonText}>나중에</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={onRequestReservation}
                  style={styles.reservationButton}>
                  <Text numberOfLines={1} style={styles.reservationButtonText}>홈에서 예약하기</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  activityCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: TIMETABLE_COLORS.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 10, padding: 10 },
  activityCount: { color: TIMETABLE_COLORS.text, fontSize: 13, fontWeight: '800', lineHeight: 19 },
  activityDescription: { color: TIMETABLE_COLORS.secondaryText, fontSize: 13, lineHeight: 19 },
  activityEmoji: { fontSize: 22 },
  activityIcon: { alignItems: 'center', backgroundColor: '#DDEFD9', borderRadius: 14, height: 44, justifyContent: 'center', width: 44 },
  activityList: { backgroundColor: '#F8F2E7', borderColor: '#EFE2CD', borderRadius: 18, borderWidth: 1, height: 110, marginTop: 7 },
  activityListContent: { gap: 9, padding: 6 },
  activityListContainer: { marginTop: 12 },
  activityListHeading: { marginTop: 10, paddingHorizontal: 2 },
  activityMetadata: { color: TIMETABLE_COLORS.secondaryText, fontSize: 11, lineHeight: 16, marginTop: 3 },
  activityNotice: { color: '#527041', fontSize: 10, lineHeight: 15, marginTop: 4 },
  activitySection: { marginTop: 14 },
  activityErrorText: { color: '#B84738', fontSize: 12, lineHeight: 18, textAlign: 'center' },
  activityStatus: { alignItems: 'center', backgroundColor: '#F8F2E7', borderColor: '#EFE2CD', borderRadius: 18, borderWidth: 1, justifyContent: 'center', marginTop: 7, minHeight: 110, padding: 16 },
  activityStatusText: { color: TIMETABLE_COLORS.secondaryText, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  activityText: { flex: 1 },
  activityTitle: { color: TIMETABLE_COLORS.text, fontSize: 13, fontWeight: '800', lineHeight: 19 },
  activityToggle: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#A8D2A7', borderRadius: 13, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', paddingVertical: 13 },
  activityToggleText: { color: TIMETABLE_COLORS.primary, fontSize: 13, fontWeight: '800', marginRight: 6 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  cancelButton: { alignItems: 'center', backgroundColor: '#F4EFE6', borderRadius: 12, flex: 1, flexBasis: 0, justifyContent: 'center', minHeight: 46, paddingHorizontal: 12 },
  cancelButtonText: { color: TIMETABLE_COLORS.text, fontSize: 14, fontWeight: '800' },
  confirmDeleteButton: { alignItems: 'center', backgroundColor: '#B84738', borderRadius: 12, flex: 1, flexBasis: 0, justifyContent: 'center', minHeight: 46, paddingHorizontal: 12 },
  confirmDeleteButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  confirmationButtons: { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  confirmationCard: { alignSelf: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, maxWidth: 340, padding: 22, width: '86%' },
  confirmationDescription: { color: TIMETABLE_COLORS.secondaryText, fontSize: 13, lineHeight: 19, marginTop: 7, textAlign: 'center' },
  confirmationOverlay: { alignItems: 'center', backgroundColor: 'rgba(31, 27, 21, 0.58)', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0, zIndex: 10 },
  confirmationTitle: { color: TIMETABLE_COLORS.text, fontSize: 18, fontWeight: '800', marginTop: 12 },
  content: { paddingBottom: 14, paddingHorizontal: 14 },
  clearActivityText: { color: TIMETABLE_COLORS.primary, fontSize: 11, fontWeight: '800' },
  deleteButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#C95A4A', borderRadius: 12, borderWidth: 1, justifyContent: 'center', paddingHorizontal: 22 },
  deleteButtonText: { color: '#B84738', fontSize: 14, fontWeight: '800' },
  description: { color: TIMETABLE_COLORS.secondaryText, fontSize: 13, lineHeight: 19, marginTop: 5 },
  error: { color: '#B84738', fontSize: 12, lineHeight: 17, marginTop: 7 },
  formCard: { backgroundColor: '#FFFFFF', borderColor: TIMETABLE_COLORS.border, borderRadius: 20, borderWidth: 1, marginTop: 16, padding: 14 },
  footer: { backgroundColor: TIMETABLE_COLORS.background, borderTopColor: TIMETABLE_COLORS.border, borderTopWidth: 1, paddingHorizontal: 14, paddingTop: 12 },
  handle: { alignSelf: 'center', backgroundColor: '#CDBFA8', borderRadius: 999, height: 5, marginBottom: 12, marginTop: 8, width: 42 },
  headingRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  headingText: { flex: 1, paddingRight: 12 },
  hint: { color: TIMETABLE_COLORS.secondaryText, fontSize: 11, lineHeight: 16, marginTop: 8 },
  iconButton: { alignItems: 'center', backgroundColor: '#F2EADB', borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  input: { backgroundColor: '#FFFCF6', borderColor: TIMETABLE_COLORS.border, borderRadius: 12, borderWidth: 1, color: TIMETABLE_COLORS.text, fontSize: 15, marginTop: 7, paddingHorizontal: 13, paddingVertical: 12 },
  label: { color: TIMETABLE_COLORS.text, fontSize: 12, fontWeight: '700' },
  moreActivitiesButton: { alignItems: 'center', backgroundColor: '#F2E8D5', borderRadius: 13, marginTop: 12, paddingVertical: 13 },
  moreActivitiesButtonText: { color: TIMETABLE_COLORS.text, fontSize: 13, fontWeight: '800' },
  overlay: { alignItems: 'center', backgroundColor: 'rgba(31, 27, 21, 0.48)', flex: 1, justifyContent: 'flex-end' },
  reservationButton: { alignItems: 'center', backgroundColor: TIMETABLE_COLORS.primary, borderRadius: 12, flex: 1, flexBasis: 0, justifyContent: 'center', minHeight: 46, paddingHorizontal: 10 },
  reservationButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  reservationIcon: { alignItems: 'center', backgroundColor: TIMETABLE_COLORS.primaryLight, borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  retryActivitiesButton: { backgroundColor: TIMETABLE_COLORS.primary, borderRadius: 10, marginTop: 10, paddingHorizontal: 14, paddingVertical: 9 },
  retryActivitiesButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  selectActivityButton: { borderColor: '#9FC9AD', borderRadius: 12, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 9 },
  selectActivityButtonText: { color: TIMETABLE_COLORS.primary, fontSize: 12, fontWeight: '800' },
  selectedActivitySummary: { alignItems: 'center', backgroundColor: '#F4FAF2', borderColor: '#BDD7BF', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: 10, padding: 10 },
  sheet: { backgroundColor: TIMETABLE_COLORS.background, borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: '92%', maxWidth: 430, overflow: 'hidden', paddingTop: 4, width: '100%' },
  submitButton: { alignItems: 'center', backgroundColor: TIMETABLE_COLORS.primary, borderRadius: 12, flex: 1, paddingVertical: 14 },
  submitButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  timeRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  title: { color: TIMETABLE_COLORS.text, fontSize: 20, fontWeight: '800' },
  warningIcon: { alignItems: 'center', backgroundColor: '#FBEAE7', borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
});
