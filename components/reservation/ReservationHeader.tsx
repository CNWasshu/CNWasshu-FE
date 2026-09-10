import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function ReservationHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.decorCircle} />

      <View style={styles.textArea}>
        <Text style={styles.title}>
          예약 시간을 선택해 주세요
        </Text>

        <Text style={styles.subtitle}>
          원하는 날짜와 시간을 고르고
          예약 정보를 확인해 주세요.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    backgroundColor: '#3f7d46',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  decorCircle: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor:
      'rgba(255,255,255,0.10)',
  },

  textArea: {
    maxWidth: 320,
  },

  title: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: '#ffffff',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.90)',
  },
});