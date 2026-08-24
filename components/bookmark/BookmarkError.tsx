import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface BookmarkErrorProps {
  message: string;
  onRetry: () => void;
}

export function BookmarkError({
  message,
  onRetry,
}: BookmarkErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        장바구니를 불러오지 못했습니다.
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>

      <Pressable
        style={styles.retryButton}
        onPress={onRetry}
      >
        <Text style={styles.retryButtonText}>
          다시 시도
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#222222',
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});