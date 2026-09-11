import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { PAGE_LAYOUT } from '@/constants/layout';

interface ReservationBottomBarProps {
  canSubmit: boolean;
  creatingReservation: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function ReservationBottomBar({
  canSubmit,
  creatingReservation,
  onBack,
  onSubmit,
}: ReservationBottomBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
        >
          <Text
            style={styles.backText}
          >
            이전으로
          </Text>
        </Pressable>

        <Pressable
          disabled={
            !canSubmit ||
            creatingReservation
          }
          onPress={onSubmit}
          style={[
            styles.submitButton,

            (!canSubmit ||
              creatingReservation) &&
              styles.disabled,
          ]}
        >
          {creatingReservation ? (
            <ActivityIndicator
              color="#ffffff"
            />
          ) : (
            <Text
              style={styles.submitText}
            >
              예약 확정하기
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#eadcc4',
    backgroundColor: '#fffaf1',
  },

  inner: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    paddingHorizontal: 18,
    width: '100%',
  },

  backButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: '#f1e6d3',
  },

  backText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5d4a2a',
  },

  submitButton: {
    flex: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: '#3f7d46',
  },

  disabled: {
    opacity: 0.38,
  },

  submitText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
