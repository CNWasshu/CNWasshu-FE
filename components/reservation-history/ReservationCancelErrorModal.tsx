import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ReservationCancelErrorModalProps {
  visible: boolean;
  message: string | null;
  onConfirm: () => void;
}

export function ReservationCancelErrorModal({
  visible,
  message,
  onConfirm,
}: ReservationCancelErrorModalProps) {
  if (!message) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>
              !
            </Text>
          </View>

          <Text style={styles.title}>
            예약을 취소할 수 없어요
          </Text>

          <Text style={styles.subtitle}>
            {message}
          </Text>

          <Pressable
            onPress={onConfirm}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              확인
            </Text>
          </Pressable>
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
    padding: 24,
    backgroundColor:
      'rgba(35,35,35,0.42)',
  },

  modal: {
    width: '100%',
    maxWidth: 382,
    padding: 22,
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 24,
    backgroundColor: '#fffaf1',
  },

  icon: {
    width: 58,
    height: 58,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: '#f8e8e5',
  },

  iconText: {
    fontSize: 27,
    fontWeight: '900',
    color: '#a95050',
  },

  title: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#29251e',
  },

  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: '#7d715f',
  },

  button: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: '#3f7d46',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});