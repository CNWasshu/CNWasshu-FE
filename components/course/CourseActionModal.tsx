import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourseColors } from '@/constants/course-colors';
import type { CourseSummary } from '@/types/course';

type CourseActionModalProps = {
  course: CourseSummary | null;
  errorMessage: string | null;
  isSubmitting: boolean;
  mode: 'delete' | 'rename' | null;
  onClose: () => void;
  onConfirmDelete: () => void;
  onConfirmRename: (courseName: string) => void;
};

export function CourseActionModal({
  course,
  errorMessage,
  isSubmitting,
  mode,
  onClose,
  onConfirmDelete,
  onConfirmRename,
}: CourseActionModalProps) {
  const insets = useSafeAreaInsets();
  const [nameDraft, setNameDraft] = useState('');

  useEffect(() => {
    if (mode === 'rename') {
      setNameDraft(course?.courseName ?? '');
    }
  }, [course, mode]);

  const visible = mode !== null && course !== null;
  const trimmedName = nameDraft.trim();

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

          {mode === 'rename' ? (
            <>
              <Text style={styles.title}>코스 이름 수정</Text>
              <Text style={styles.description}>새로운 코스 이름을 입력해 주세요.</Text>

              <TextInput
                autoFocus
                editable={!isSubmitting}
                maxLength={100}
                onChangeText={setNameDraft}
                placeholder="예: 부여 가족 체험 코스"
                placeholderTextColor={CourseColors.muted}
                style={styles.input}
                value={nameDraft}
              />

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

              <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
                <Pressable
                  disabled={isSubmitting}
                  onPress={onClose}
                  style={[styles.cancelButton, isSubmitting && styles.disabled]}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </Pressable>
                <Pressable
                  disabled={isSubmitting || !trimmedName}
                  onPress={() => onConfirmRename(trimmedName)}
                  style={[
                    styles.confirmButton,
                    (isSubmitting || !trimmedName) && styles.disabled,
                  ]}>
                  <Text style={styles.confirmButtonText}>
                    {isSubmitting ? '저장 중...' : '수정'}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>코스를 삭제할까요?</Text>
              <Text style={styles.description}>
                {course ? `"${course.courseName}"` : '이 코스'}를 삭제하면 되돌릴 수 없습니다.
              </Text>

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

              <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
                <Pressable
                  disabled={isSubmitting}
                  onPress={onClose}
                  style={[styles.cancelButton, isSubmitting && styles.disabled]}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </Pressable>
                <Pressable
                  disabled={isSubmitting}
                  onPress={onConfirmDelete}
                  style={[styles.deleteButton, isSubmitting && styles.disabled]}>
                  <Text style={styles.deleteButtonText}>
                    {isSubmitting ? '삭제 중...' : '삭제'}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
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
  confirmButton: {
    alignItems: 'center',
    backgroundColor: CourseColors.primary,
    borderRadius: 13,
    flex: 1,
    paddingVertical: 14,
  },
  confirmButtonText: { color: CourseColors.white, fontSize: 14, fontWeight: '800' },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: CourseColors.error,
    borderRadius: 13,
    flex: 1,
    paddingVertical: 14,
  },
  deleteButtonText: { color: CourseColors.white, fontSize: 14, fontWeight: '800' },
  description: { color: CourseColors.muted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  disabled: { opacity: 0.55 },
  error: { color: CourseColors.error, fontSize: 12, lineHeight: 17, marginTop: 8 },
  footer: { flexDirection: 'row', gap: 10, marginTop: 20 },
  handle: {
    alignSelf: 'center',
    backgroundColor: '#CDBFA8',
    borderRadius: 999,
    height: 5,
    marginBottom: 14,
    width: 42,
  },
  input: {
    backgroundColor: '#FFFCF6',
    borderColor: CourseColors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: CourseColors.text,
    fontSize: 14,
    marginTop: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
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
