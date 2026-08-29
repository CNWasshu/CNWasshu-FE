import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface BookmarkDeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function BookmarkDeleteModal({
  visible,
  onCancel,
  onConfirm,
}: BookmarkDeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            장바구니 삭제
          </Text>

          <Text style={styles.message}>
            장바구니에서 삭제하시겠습니까?
          </Text>

          <Text style={styles.description}>
            삭제한 항목은 다시 장바구니에 담을 수 있습니다.
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.button,
                styles.cancelButton,
              ]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>
                취소
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.deleteButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.deleteButtonText}>
                삭제
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalContainer: {
    width: '100%',
    maxWidth: 360,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
    marginBottom: 24,
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },

  cancelButton: {
    backgroundColor: '#F2F2F2',
  },

  deleteButton: {
    backgroundColor: '#222222',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },

  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});