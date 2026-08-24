import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export function BookmarkLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />

      <Text style={styles.text}>
        장바구니를 불러오는 중입니다.
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

  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
});