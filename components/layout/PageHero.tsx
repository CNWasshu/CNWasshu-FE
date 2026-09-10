import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BackHeader } from '@/components/common/BackHeader';
import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';

type PageHeroProps = {
  description: string;
  eyebrow: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  badge?: string;
  showBack?: boolean;
  trailing?: ReactNode;
};

export function PageHero({
  badge,
  description,
  eyebrow,
  icon,
  showBack = false,
  title,
  trailing,
}: PageHeroProps) {
  const { width } = useWindowDimensions();
  const isDesktopWeb =
    Platform.OS === 'web' && width >= PAGE_LAYOUT.desktopNavigationBreakpoint;

  return (
    <View style={[styles.hero, isDesktopWeb && styles.heroDesktop]}>
      <View style={styles.inner}>
        {showBack ? <BackHeader /> : null}
        <View style={styles.topRow}>
          <View style={styles.eyebrowRow}>
            <Ionicons color="#EAF5E7" name={icon} size={17} />
            <Text style={styles.eyebrow}>{eyebrow}</Text>
          </View>
          {badge ? <Text style={styles.badge}>{badge}</Text> : trailing}
        </View>
        <Text style={[styles.title, isDesktopWeb && styles.titleDesktop]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: CourseColors.hero,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 26,
    paddingHorizontal: 18,
    paddingTop: 18,
    width: '100%',
  },
  heroDesktop: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 168,
    paddingBottom: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inner: {
    alignSelf: 'center',
    maxWidth: PAGE_LAYOUT.desktopHeroMaxWidth,
    width: '100%',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  eyebrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  eyebrow: {
    color: '#EAF5E7',
    fontSize: 12,
    fontWeight: '800',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    color: CourseColors.white,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  title: {
    color: CourseColors.white,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.7,
    lineHeight: 35,
    marginTop: 10,
  },
  titleDesktop: {
    fontSize: 30,
    lineHeight: 39,
  },
  description: {
    color: '#E4EFE1',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 650,
  },
});
