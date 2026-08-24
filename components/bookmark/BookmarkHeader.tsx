import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface BookmarkHeaderProps {
  count: number;
  onBack: () => void;
}

export function BookmarkHeader({
  count,
  onBack,
}: BookmarkHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backIcon}>
            {'<'}
          </Text>
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            장바구니
          </Text>

          <Text style={styles.description}>
            담아둔 여행지를 확인해보세요.
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {count}개
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 32,
    height: 40,
    marginRight: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  backIcon: {
    color: '#3F7D46',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    color: '#29251E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  description: {
    marginTop: 3,
    color: '#766F63',
    fontSize: 11,
  },

  countBadge: {
    marginLeft: 10,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#E7F4E2',
  },

  countText: {
    color: '#3F7D46',
    fontSize: 11,
    fontWeight: '900',
  },
});