import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourseColors } from '@/constants/course-colors';

type DeleteAccountModalProps = {
  errorMessage: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  visible: boolean;
};

export function DeleteAccountModal({
  errorMessage,
  isSubmitting,
  onClose,
  onConfirm,
  visible,
}: DeleteAccountModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      onRequestClose={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headingRow}>
            <View style={styles.headingText}>
              <Text style={styles.title}>정말 탈퇴하시겠어요?</Text>
              <Text style={styles.description}>
                탈퇴하면 저장된 코스, 스탬프, 알림 기록이 모두 삭제되며 되돌릴 수 없습니다.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="닫기"
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={onClose}
              style={[styles.closeButton, isSubmitting && styles.disabled]}>
              <Ionicons color={CourseColors.muted} name="close" size={17} />
            </Pressable>
          </View>

          {errorMessage ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {errorMessage}
            </Text>
          ) : null}

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={onClose}
              style={[styles.cancelButton, isSubmitting && styles.disabled]}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={onConfirm}
              style={[styles.confirmButton, isSubmitting && styles.disabled]}>
              <Text style={styles.confirmButtonText}>
                {isSubmitting ? '탈퇴 처리 중...' : '탈퇴하기'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    alignItems: 'center',
    backgroundColor: CourseColors.beige,
    borderRadius: 13,
    flex: 1,
    paddingVertical: 14,
  },
  cancelButtonText: { color: CourseColors.text, fontSize: 14, fontWeight: '800' },
  closeButton: {
    alignItems: 'center',
    backgroundColor: CourseColors.beige,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: CourseColors.error,
    borderRadius: 13,
    flex: 1,
    paddingVertical: 14,
  },
  confirmButtonText: { color: CourseColors.white, fontSize: 14, fontWeight: '800' },
  description: { color: CourseColors.muted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  disabled: { opacity: 0.55 },
  error: { color: CourseColors.error, fontSize: 12, lineHeight: 17, marginTop: 14 },
  footer: { flexDirection: 'row', gap: 10, marginTop: 24 },
  handle: {
    alignSelf: 'center',
    backgroundColor: '#CDBFA8',
    borderRadius: 999,
    height: 5,
    marginBottom: 14,
    width: 42,
  },
  headingRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  headingText: { flex: 1, paddingRight: 12 },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(31, 27, 21, 0.48)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: CourseColors.background,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxWidth: 430,
    paddingHorizontal: 17,
    paddingTop: 14,
    width: '100%',
  },
  title: { color: CourseColors.text, fontSize: 20, fontWeight: '800' },
});
