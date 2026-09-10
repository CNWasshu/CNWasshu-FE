import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';

type TimetableExitModalProps = {
  onContinue: () => void;
  onExit: () => void;
  visible: boolean;
};

export function TimetableExitModal({
  onContinue,
  onExit,
  visible,
}: TimetableExitModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onContinue}
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text style={styles.title}>작성을 그만둘까요?</Text>
          <Text style={styles.description}>
            저장하지 않은 일정은 사라집니다.
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onContinue}
              style={styles.continueButton}>
              <Text style={styles.continueButtonText}>계속 작성</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onExit}
              style={styles.exitButton}>
              <Text style={styles.exitButtonText}>나가기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  continueButton: {
    alignItems: 'center',
    borderColor: TIMETABLE_COLORS.border,
    borderRadius: 13,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 13,
  },
  continueButtonText: {
    color: TIMETABLE_COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  description: {
    color: TIMETABLE_COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  dialog: {
    backgroundColor: TIMETABLE_COLORS.background,
    borderRadius: 22,
    maxWidth: 340,
    padding: 22,
    width: '88%',
  },
  exitButton: {
    alignItems: 'center',
    backgroundColor: '#B84738',
    borderRadius: 13,
    flex: 1,
    paddingVertical: 13,
  },
  exitButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(31, 27, 21, 0.48)',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: TIMETABLE_COLORS.text,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
});
