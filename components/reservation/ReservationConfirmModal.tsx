import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ReservationConfirmModalProps {
  visible: boolean;

  activityTitle: string;
  reservationDate: string;
  reservationTime: string;
  duration: number | null;
  peopleCount: number;
  withChild: boolean;

  submitting: boolean;

  onCancel: () => void;
  onConfirm: () => void;
}

function addMinutes(
  time: string,
  minutes: number
) {
  const [hour, minute] =
    time
      .slice(0, 5)
      .split(':')
      .map(Number);

  const total =
    hour * 60 +
    minute +
    minutes;

  return `${String(
    Math.floor(total / 60)
  ).padStart(2, '0')}:${String(
    total % 60
  ).padStart(2, '0')}`;
}

export function ReservationConfirmModal({
  visible,
  activityTitle,
  reservationDate,
  reservationTime,
  duration,
  peopleCount,
  withChild,
  submitting,
  onCancel,
  onConfirm,
}: ReservationConfirmModalProps) {
  const start =
    reservationTime.slice(0, 5);

  const end = duration
    ? addMinutes(
        reservationTime,
        duration
      )
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              예약 확인
            </Text>
          </View>

          <Text style={styles.title}>
            이 내용으로 예약하시겠어요?
          </Text>

          <Text style={styles.activity}>
            {activityTitle}
          </Text>

          <View style={styles.summary}>
            <View style={styles.row}>
              <Text style={styles.label}>
                날짜
              </Text>

              <Text style={styles.value}>
                {reservationDate}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                시간
              </Text>

              <Text style={styles.value}>
                {start}
                {end
                  ? ` ~ ${end}`
                  : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                인원
              </Text>

              <Text style={styles.value}>
                {peopleCount}명
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                아이 동반
              </Text>

              <Text style={styles.value}>
                {withChild
                  ? '동반'
                  : '미동반'}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              disabled={submitting}
              onPress={onCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                취소
              </Text>
            </Pressable>

            <Pressable
              disabled={submitting}
              onPress={onConfirm}
              style={styles.confirmButton}
            >
              <Text
                style={styles.confirmText}
              >
                {submitting
                  ? '예약 중...'
                  : '예약하기'}
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
    backgroundColor: '#FAF7F0',
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#e8f5e4',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3F7045',
  },

  title: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: '800',
    color: '#262822',
  },

  activity: {
    marginTop: 7,
    fontSize: 14,
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
    fontSize: 13,
    color: '#827563',
  },

  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: '#3f4937',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },

  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: '#f1e6d3',
  },

  cancelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5d4a2a',
  },

  confirmButton: {
    flex: 1.2,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: '#3F7045',
  },

  confirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});