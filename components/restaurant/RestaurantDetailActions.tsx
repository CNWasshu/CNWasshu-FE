import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type RestaurantDetailActionsProps = {
  isBookmarked: boolean;
  onBookmarkPress: () => void;
};

export function RestaurantDetailActions({
  isBookmarked,
  onBookmarkPress,
}: RestaurantDetailActionsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isBookmarked
            ? '담은 장소에서 삭제'
            : '담은 장소에 추가'
        }
        style={[
          styles.bookmarkButton,
          isBookmarked &&
            styles.bookmarkedButton,
        ]}
        onPress={onBookmarkPress}
      >
        <Text
          style={[
            styles.bookmarkText,
            isBookmarked &&
              styles.bookmarkedText,
          ]}
        >
          {isBookmarked
            ? '♥ 담았어요'
            : '♡ 담아두기'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },

  bookmarkButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#BFD9B7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  bookmarkedButton: {
    backgroundColor: '#E7F4E2',
    borderColor: '#A8CFA0',
  },

  bookmarkText: {
    color: '#3F7D46',
    fontSize: 13,
    fontWeight: '900',
  },

  bookmarkedText: {
    color: '#3F7D46',
  },
});
