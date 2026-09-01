import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ReservationResponse } from '@/types/reservation';

interface ReservationCancelModalProps {
  visible: boolean;
  reservation:
    | ReservationResponse
    | null;

  submitting: boolean;

  onClose: () => void;
  onConfirm: () => void;
}

export function ReservationCancelModal({
  visible,
  reservation,
  submitting,
  onClose,
  onConfirm,
}: ReservationCancelModalProps) {
  if (!reservation) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              예약 취소
            </Text>
          </View>

          <Text style={styles.title}>
            이 예약을 취소하시겠어요?
          </Text>

          <Text style={styles.activity}>
            {reservation.activityTitle}
          </Text>

          <View style={styles.summary}>
            <View style={styles.row}>
              <Text style={styles.label}>
                날짜
              </Text>

              <Text style={styles.value}>
                {reservation.reservationDate}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                시간
              </Text>

              <Text style={styles.value}>
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
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                인원
              </Text>

              <Text style={styles.value}>
                {reservation.peopleCount}명
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                아이 동반
              </Text>

              <Text style={styles.value}>
                {reservation.withChild
                  ? '동반'
                  : '미동반'}
              </Text>
            </View>
          </View>

          <Text style={styles.notice}>
            당일 예약은 앱에서 취소할 수 없어요.
            {'\n'}
            당일 취소는 전화로 문의해 주세요.
          </Text>

          <View style={styles.actions}>
            <Pressable
              disabled={submitting}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>
                돌아가기
              </Text>
            </Pressable>

            <Pressable
              disabled={submitting}
              onPress={onConfirm}
              style={[
                styles.confirmButton,
                submitting &&
                  styles.disabledButton,
              ]}
            >
              <Text style={styles.confirmText}>
                {submitting
                  ? '취소 중...'
                  : '예약 취소'}
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
    padding: 24,
    backgroundColor:
      'rgba(35,35,35,0.42)',
  },

  modal: {
    width: '100%',
    maxWidth: 382,
    padding: 20,
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 24,
    backgroundColor: '#fffaf1',
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#f8e8e5',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a95050',
  },

  title: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: '800',
    color: '#29251e',
  },

  activity: {
    marginTop: 7,
    fontSize: 13,
    color: '#766749',
  },

  summary: {
    gap: 11,
    marginTop: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 18,
    backgroundColor: '#ffffff',
  },

  row: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    gap: 20,
  },

  label: {
    fontSize: 12,
    color: '#827563',
  },

  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12.5,
    fontWeight: '700',
    color: '#3f4937',
  },

  notice: {
    marginTop: 14,
    fontSize: 11.5,
    lineHeight: 18,
    color: '#8c6b64',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },

  closeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: '#f1e6d3',
  },

  closeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5d4a2a',
  },

  confirmButton: {
    flex: 1.2,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: '#a95050',
  },

  confirmText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },

  disabledButton: {
    opacity: 0.55,
  },
});