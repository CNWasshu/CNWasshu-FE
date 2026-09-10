import { StyleSheet, Text, View } from 'react-native';

export function BookmarkEmpty() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        장바구니가 비어 있어요.
      </Text>

      <Text style={styles.description}>
        관심 있는 체험이나 맛집을 장바구니에 담아보세요.
      </Text>
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

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
    textAlign: 'center',
  },
});