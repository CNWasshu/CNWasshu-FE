import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ReservationResponse } from '@/types/reservation';

interface ReservationDuplicateModalProps {
  visible: boolean;
  reservation: ReservationResponse | null;
  onConfirm: () => void;
}

export function ReservationDuplicateModal({
  visible,
  reservation,
  onConfirm,
}: ReservationDuplicateModalProps) {
  if (!reservation) {
    return null;
  }

  const startTime =
    reservation.reservationTime.slice(0, 5);

  const endTime =
    reservation.endTime?.slice(0, 5);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            이미 예약 내역이 있어요
          </Text>

          <View style={styles.reservationInfo}>
            <Text style={styles.activityTitle}>
              {reservation.activityTitle}
            </Text>

            <Text style={styles.date}>
              {reservation.reservationDate}
            </Text>

            <Text style={styles.time}>
              {startTime}
              {endTime
                ? ` ~ ${endTime}`
                : ''}
            </Text>

            <Text style={styles.meta}>
              {reservation.peopleCount}명
              {' · '}
              {reservation.withChild
                ? '아이 동반'
                : '아이 미동반'}
            </Text>
          </View>

          <Text style={styles.description}>
            이 체험은 같은 날짜에 한 번만
            예약할 수 있어요.{'\n'}
            다른 날짜를 선택해 주세요.
          </Text>

          <Pressable
            accessibilityRole="button"
            style={styles.confirmButton}
            onPress={onConfirm}
          >
            <Text style={styles.confirmText}>
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
      'rgba(35,35,35,0.38)',
  },

  modal: {
    width: '100%',
    maxWidth: 350,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EFE3CE',
    borderRadius: 22,
    backgroundColor: '#FFFAF1',
  },

  title: {
    color: '#29251E',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
  },

  reservationInfo: {
    marginTop: 16,
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#F4E9D7',
  },

  activityTitle: {
    color: '#29251E',
    fontSize: 14,
    fontWeight: '800',
  },

  date: {
    marginTop: 9,
    color: '#766749',
    fontSize: 13,
    fontWeight: '600',
  },

  time: {
    marginTop: 3,
    color: '#3F7D46',
    fontSize: 17,
    fontWeight: '900',
  },

  meta: {
    marginTop: 6,
    color: '#8A7450',
    fontSize: 13,
    fontWeight: '700',
  },

  description: {
    marginTop: 17,
    color: '#766749',
    fontSize: 14,
    lineHeight: 20,
  },

  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: '#3F7D46',
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});