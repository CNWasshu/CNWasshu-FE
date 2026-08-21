import Ionicons from '@expo/vector-icons/Ionicons';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { formatDate } from '@/utils/timetable/date';

type TimetableSaveModalProps = {
  courseName: string;
  endDate: Date;
  errorMessage: string | null;
  isSaving: boolean;
  isSuccess: boolean;
  onChangeCourseName: (name: string) => void;
  onClose: () => void;
  onSave: () => void;
  scheduleCount: number;
  startDate: Date;
  visible: boolean;
};

export function TimetableSaveModal({
  courseName,
  endDate,
  errorMessage,
  isSaving,
  isSuccess,
  onChangeCourseName,
  onClose,
  onSave,
  scheduleCount,
  startDate,
  visible,
}: TimetableSaveModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      onRequestClose={() => {
        if (!isSaving) {
          onClose();
        }
      }}
      transparent
      visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headingRow}>
            <View style={styles.headingText}>
              <Text style={styles.title}>코스 저장하기</Text>
              <Text style={styles.description}>
                같은 날짜에도 여러 코스를 저장할 수 있도록 코스 이름을 입력해 주세요.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="닫기"
              accessibilityRole="button"
              disabled={isSaving}
              onPress={onClose}
              style={[styles.closeButton, isSaving && styles.disabled]}>
              <Ionicons color={TIMETABLE_COLORS.secondaryText} name="close" size={17} />
            </Pressable>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>코스 이름</Text>
            <TextInput
              accessibilityLabel="코스 이름"
              autoFocus
              editable={!isSaving && !isSuccess}
              maxLength={100}
              onChangeText={onChangeCourseName}
              placeholder="예: 부여 가족 체험 코스"
              placeholderTextColor="#A49A89"
              returnKeyType="done"
              style={styles.input}
              value={courseName}
            />
            <Text style={styles.summary}>
              {formatDate(startDate)} ~ {formatDate(endDate)} · 총 {scheduleCount}개 일정
            </Text>
            {errorMessage ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {errorMessage}
              </Text>
            ) : null}
            {isSuccess ? (
              <Text accessibilityRole="alert" style={styles.success}>
                코스를 저장했습니다.
              </Text>
            ) : null}
          </View>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <Pressable
              accessibilityRole="button"
              disabled={isSaving || isSuccess}
              onPress={onSave}
              style={[
                styles.saveButton,
                (isSaving || isSuccess) && styles.disabled,
              ]}>
              <Text style={styles.saveButtonText}>
                {isSaving ? '저장 중...' : isSuccess ? '저장 완료' : '저장하기'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: { alignItems: 'center', backgroundColor: '#F2EADB', borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  description: { color: TIMETABLE_COLORS.secondaryText, fontSize: 13, lineHeight: 19, marginTop: 5 },
  disabled: { opacity: 0.55 },
  error: { color: '#B84738', fontSize: 12, lineHeight: 17, marginTop: 8 },
  footer: { marginTop: 28 },
  formCard: { backgroundColor: '#FFFFFF', borderColor: TIMETABLE_COLORS.border, borderRadius: 20, borderWidth: 1, marginTop: 16, padding: 14 },
  handle: { alignSelf: 'center', backgroundColor: '#CDBFA8', borderRadius: 999, height: 5, marginBottom: 14, width: 42 },
  headingRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  headingText: { flex: 1, paddingRight: 12 },
  input: { backgroundColor: '#FFFCF6', borderColor: TIMETABLE_COLORS.border, borderRadius: 12, borderWidth: 1, color: TIMETABLE_COLORS.text, fontSize: 14, marginTop: 7, paddingHorizontal: 13, paddingVertical: 12 },
  label: { color: TIMETABLE_COLORS.secondaryText, fontSize: 12, fontWeight: '700' },
  overlay: { alignItems: 'center', backgroundColor: 'rgba(31, 27, 21, 0.48)', flex: 1, justifyContent: 'flex-end' },
  saveButton: { alignItems: 'center', backgroundColor: TIMETABLE_COLORS.primary, borderRadius: 13, paddingVertical: 14 },
  saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  sheet: { backgroundColor: TIMETABLE_COLORS.background, borderTopLeftRadius: 26, borderTopRightRadius: 26, maxWidth: 430, paddingHorizontal: 17, paddingTop: 14, width: '100%' },
  summary: { color: TIMETABLE_COLORS.secondaryText, fontSize: 12, lineHeight: 18, marginTop: 10 },
  success: { color: TIMETABLE_COLORS.primary, fontSize: 12, fontWeight: '800', lineHeight: 18, marginTop: 8 },
  title: { color: TIMETABLE_COLORS.text, fontSize: 20, fontWeight: '800' },
});
