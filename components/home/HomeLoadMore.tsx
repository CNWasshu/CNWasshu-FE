import {
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

type HomeLoadMoreProps = {
  onPress: () => void;
};

export function HomeLoadMore({
  onPress,
}: HomeLoadMoreProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="더 보기"
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.icon}>
        ⌄
      </Text>

      <Text style={styles.text}>
        더 보기
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
    paddingVertical: 14,
  },

  icon: {
    color: '#3F7D46',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 30,
  },

  text: {
    marginTop: 2,
    color: '#6B5730',
    fontSize: 12,
    fontWeight: '800',
  },
});