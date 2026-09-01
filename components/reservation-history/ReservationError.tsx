import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ReservationErrorProps {
  message: string;
  onRetry: () => void;
}

export function ReservationError({
  message,
  onRetry,
}: ReservationErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>
        !
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>

      <Pressable
        style={styles.retryButton}
        onPress={onRetry}
      >
        <Text style={styles.retryText}>
          다시 시도
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  icon: {
    width: 38,
    height: 38,
    paddingTop: 8,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#FFF1ED',
    color: '#B95555',
    fontWeight: '900',
    textAlign: 'center',
  },

  message: {
    marginTop: 12,
    color: '#8A5E5E',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },

  retryButton: {
    minWidth: 120,
    minHeight: 42,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3F7D46',
  },

  retryText: {
    color: '#3F7D46',
    fontSize: 12,
    fontWeight: '900',
  },
});