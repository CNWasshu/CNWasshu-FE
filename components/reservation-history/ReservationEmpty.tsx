import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export function ReservationEmpty() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>
        🌿
      </Text>

      <Text style={styles.title}>
        예약 내역이 없어요
      </Text>

      <Text style={styles.description}>
        체험을 예약하면{'\n'}
        이곳에서 확인할 수 있어요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  emoji: {
    marginBottom: 12,
    fontSize: 42,
  },

  title: {
    color: '#29251E',
    fontSize: 17,
    fontWeight: '900',
  },

  description: {
    marginTop: 8,
    color: '#8A8378',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
});