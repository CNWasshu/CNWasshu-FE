import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export function ReservationLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#3F7D46"
      />

      <Text style={styles.text}>
        예약 내역을 불러오고 있어요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  text: {
    color: '#8A8378',
    fontSize: 14,
  },
});