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

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { TimetableTimeInput } from '@/components/timetable/TimetableTimeInput';
import type { TimetableSchedule } from '@/types/timetable';
import { validateScheduleInput } from '@/utils/timetable/time';

type ScheduleFormValue = Pick<TimetableSchedule, 'endTime' | 'startTime' | 'title'>;

type TimetableScheduleModalProps = {
  dayLabel: string;
  onClose: () => void;
  onDelete?: () => void;
  onSubmit: (value: ScheduleFormValue) => void;
  schedule?: TimetableSchedule | null;
  visible: boolean;
};

const INITIAL_START_TIME = '09:00';
const INITIAL_END_TIME = '10:00';

export function TimetableScheduleModal({
  dayLabel,
  onClose,
  onDelete,
  onSubmit,
  schedule,
  visible,
}: TimetableScheduleModalProps) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(INITIAL_START_TIME);
  const [endTime, setEndTime] = useState(INITIAL_END_TIME);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const isEditing = Boolean(schedule);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle(schedule?.title ?? '');
    setStartTime(schedule?.startTime ?? INITIAL_START_TIME);
    setEndTime(schedule?.endTime ?? INITIAL_END_TIME);
    setErrorMessage(null);
    setIsDeleteConfirmationVisible(false);
  }, [schedule, visible]);

  const handleSubmit = () => {
    const validationMessage = validateScheduleInput(title, startTime, endTime);
    setErrorMessage(validationMessage);

    if (validationMessage) {
      return;
    }

    onSubmit({ endTime, startTime, title: title.trim() });
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <Pressable accessibilityLabel="일정 창 닫기" onPress={onClose} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.headingRow}>
              <View style={styles.headingText}>
                <Text style={styles.title}>{isEditing ? '일정 수정' : '일정 추가'}</Text>
                <Text style={styles.description}>
                  {dayLabel}에 자유 일정을 {isEditing ? '수정합니다.' : '추가합니다.'}
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
                maxLength={40}
                onChangeText={setTitle}
                placeholder="예: 7시 출발, 점심 식사, 카페 휴식"
                placeholderTextColor="#A49A89"
                returnKeyType="done"
                style={styles.input}
                value={title}
              />

              <View style={styles.timeRow}>
                <TimetableTimeInput label="시작 시간" onChangeTime={setStartTime} value={startTime} />
                <TimetableTimeInput label="종료 시간" onChangeTime={setEndTime} value={endTime} />
              </View>
              <Text style={styles.hint}>09:00~22:00 사이에서 5분 단위로 선택할 수 있습니다.</Text>
              {errorMessage ? <Text accessibilityRole="alert" style={styles.error}>{errorMessage}</Text> : null}
            </View>

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
          </ScrollView>
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 28 },
  cancelButton: { alignItems: 'center', backgroundColor: '#F4EFE6', borderRadius: 12, flex: 1, flexBasis: 0, justifyContent: 'center', minHeight: 46, paddingHorizontal: 12 },
  cancelButtonText: { color: TIMETABLE_COLORS.text, fontSize: 14, fontWeight: '800' },
  confirmDeleteButton: { alignItems: 'center', backgroundColor: '#B84738', borderRadius: 12, flex: 1, flexBasis: 0, justifyContent: 'center', minHeight: 46, paddingHorizontal: 12 },
  confirmDeleteButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  confirmationButtons: { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  confirmationCard: { alignSelf: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, maxWidth: 340, padding: 22, width: '86%' },
  confirmationDescription: { color: TIMETABLE_COLORS.secondaryText, fontSize: 13, lineHeight: 19, marginTop: 7, textAlign: 'center' },
  confirmationOverlay: { alignItems: 'center', backgroundColor: 'rgba(31, 27, 21, 0.58)', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0, zIndex: 10 },
  confirmationTitle: { color: TIMETABLE_COLORS.text, fontSize: 18, fontWeight: '800', marginTop: 12 },
  content: { paddingBottom: 20, paddingHorizontal: 14 },
  deleteButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#C95A4A', borderRadius: 12, borderWidth: 1, justifyContent: 'center', paddingHorizontal: 22 },
  deleteButtonText: { color: '#B84738', fontSize: 14, fontWeight: '800' },
  description: { color: TIMETABLE_COLORS.secondaryText, fontSize: 13, lineHeight: 19, marginTop: 5 },
  error: { color: '#B84738', fontSize: 12, lineHeight: 17, marginTop: 7 },
  formCard: { backgroundColor: '#FFFFFF', borderColor: TIMETABLE_COLORS.border, borderRadius: 20, borderWidth: 1, marginTop: 16, padding: 14 },
  handle: { alignSelf: 'center', backgroundColor: '#CDBFA8', borderRadius: 999, height: 5, marginBottom: 12, marginTop: 8, width: 42 },
  headingRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  headingText: { flex: 1, paddingRight: 12 },
  hint: { color: TIMETABLE_COLORS.secondaryText, fontSize: 11, lineHeight: 16, marginTop: 8 },
  iconButton: { alignItems: 'center', backgroundColor: '#F2EADB', borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  input: { backgroundColor: '#FFFCF6', borderColor: TIMETABLE_COLORS.border, borderRadius: 12, borderWidth: 1, color: TIMETABLE_COLORS.text, fontSize: 15, marginTop: 7, paddingHorizontal: 13, paddingVertical: 12 },
  label: { color: TIMETABLE_COLORS.text, fontSize: 12, fontWeight: '700' },
  overlay: { alignItems: 'center', backgroundColor: 'rgba(31, 27, 21, 0.48)', flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: TIMETABLE_COLORS.background, borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: '92%', maxWidth: 430, paddingTop: 4, width: '100%' },
  submitButton: { alignItems: 'center', backgroundColor: TIMETABLE_COLORS.primary, borderRadius: 12, flex: 1, paddingVertical: 14 },
  submitButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  timeRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  title: { color: TIMETABLE_COLORS.text, fontSize: 20, fontWeight: '800' },
  warningIcon: { alignItems: 'center', backgroundColor: '#FBEAE7', borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
});
