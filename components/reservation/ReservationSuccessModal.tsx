import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ReservationResponse } from '@/types/reservation';

interface ReservationSuccessModalProps {
  visible: boolean;
  reservation:
    | ReservationResponse
    | null;
  onConfirm: () => void;
}

export function ReservationSuccessModal({
  visible,
  reservation,
  onConfirm,
}: ReservationSuccessModalProps) {
  if (!reservation) {
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
              ✓
            </Text>
          </View>

          <Text style={styles.title}>
            예약이 완료되었습니다
          </Text>

          <Text style={styles.subtitle}>
            예약 시간에 맞춰 방문해 주세요.
          </Text>

          <View style={styles.card}>
            <Text
              style={styles.activityTitle}
            >
              {reservation.activityTitle}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.info}>
              {reservation.reservationDate}
            </Text>

            <Text style={styles.time}>
              {reservation.reservationTime.slice(
                0,
                5
              )}
              {' ~ '}
              {reservation.endTime.slice(
                0,
                5
              )}
            </Text>

            <Text style={styles.meta}>
              {reservation.peopleCount}명
              {' · '}
              {reservation.withChild
                ? '아이 동반'
                : '아이 미동반'}
            </Text>
          </View>

          <Pressable
            onPress={onConfirm}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              확인하기
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
    backgroundColor: '#FAF7F0',
  },

  icon: {
    width: 58,
    height: 58,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: '#e8f5e4',
  },

  iconText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3F7045',
  },

  title: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#262822',
  },

  subtitle: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 14,
    color: '#7d715f',
  },

  card: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 18,
    backgroundColor: '#ffffff',
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#262822',
  },

  divider: {
    height: 1,
    marginVertical: 13,
    backgroundColor: '#efe3ce',
  },

  info: {
    fontSize: 13,
    color: '#766749',
  },

  time: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '800',
    color: '#3F7045',
  },

  meta: {
    marginTop: 8,
    fontSize: 13,
    color: '#766749',
  },

  button: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: '#3F7045',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});