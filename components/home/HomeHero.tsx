import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type HomeHeroProps = {
  onAiRecommend: () => void;
  onBookmarkPress: () => void;
};

export function HomeHero({
  onAiRecommend,
  onBookmarkPress,
}: HomeHeroProps) {
  return (
    <View style={styles.hero}>
      <View style={styles.statusRow}>
        <Text style={styles.statusTitle}>
          충남 체험 백과사전
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="장바구니"
          style={styles.bookmarkButton}
          onPress={onBookmarkPress}
        >
          <Text style={styles.bookmarkIcon}>
            ♡
          </Text>
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>
            농촌 여행 만들기
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          활동을 고르면{'\n'}
          나만의 충남 여행이 완성돼요
        </Text>

        <Text style={styles.heroDescription}>
          원하는 체험과 맛집을 둘러보고{'\n'}
          나만의 충남 여행을 만들어보세요.
        </Text>
      </View>

      <View style={styles.aiCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>
            AI 추천
          </Text>
        </View>

        <View style={styles.aiRow}>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>
              어디 갈지 고민된다면?
            </Text>

            <Text style={styles.aiDescription}>
              여행 조건에 맞는 코스를 추천받아보세요.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            style={styles.aiButton}
            onPress={onAiRecommend}
          >
            <Text style={styles.aiButtonText}>
              ✨ 추천받기
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#4C884D',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  bookmarkButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },

  bookmarkIcon: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 25,
  },

  heroCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },

  heroBadgeText: {
    color: '#3F7D46',
    fontSize: 11,
    fontWeight: '900',
  },

  heroTitle: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -0.7,
    lineHeight: 32,
  },

  heroDescription: {
    marginTop: 8,
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 13,
    lineHeight: 20,
  },

  aiCard: {
    marginTop: 12,
    padding: 15,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
  },

  aiRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  aiTextContainer: {
    flex: 1,
  },

  aiTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  aiDescription: {
    marginTop: 4,
    color: 'rgba(255, 255, 255, 0.90)',
    fontSize: 11,
    lineHeight: 16,
  },

  aiButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },

  aiButtonText: {
    color: '#3F7D46',
    fontSize: 12,
    fontWeight: '900',
  },
});