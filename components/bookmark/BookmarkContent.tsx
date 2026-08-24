import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookmarkCard } from '@/components/bookmark/BookmarkCard';
import { BookmarkEmpty } from '@/components/bookmark/BookmarkEmpty';
import { BookmarkError } from '@/components/bookmark/BookmarkError';
import { BookmarkHeader } from '@/components/bookmark/BookmarkHeader';
import { BookmarkLoading } from '@/components/bookmark/BookmarkLoading';
import type { BookmarkResponse } from '@/types/bookmark';

interface BookmarkContentProps {
  bookmarks: BookmarkResponse[];
  loading: boolean;
  errorMessage: string;

  onBack: () => void;
  onPress: (bookmark: BookmarkResponse) => void;
  onRemove: (bookmark: BookmarkResponse) => void;
  onRetry: () => void;
}

export function BookmarkContent({
  bookmarks,
  loading,
  errorMessage,

  onBack,
  onPress,
  onRemove,
  onRetry,
}: BookmarkContentProps) {
  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <BookmarkHeader
            count={bookmarks.length}
            onBack={onBack}
          />

          {loading ? (
            <BookmarkLoading />
          ) : errorMessage ? (
            <BookmarkError
              message={errorMessage}
              onRetry={onRetry}
            />
          ) : bookmarks.length === 0 ? (
            <BookmarkEmpty />
          ) : (
            <View style={styles.grid}>
              {bookmarks.map((bookmark) => (
                <View
                  key={bookmark.bookmarkId}
                  style={styles.cardWrapper}
                >
                  <BookmarkCard
                    bookmark={bookmark}
                    onPress={() =>
                      onPress(bookmark)
                    }
                    onRemove={() =>
                      onRemove(bookmark)
                    }
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFAF1',
  },

  scroll: {
    flex: 1,
    backgroundColor: '#FFFAF1',
  },

  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: '#FFFAF1',
  },

  screen: {
    width: '100%',
    maxWidth: 430,
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 30,
    backgroundColor: '#FFFAF1',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },

  cardWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
});