import { PAGE_LAYOUT } from '@/constants/layout';
import type { PropsWithChildren } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewProps } from 'react-native';

type PageContainerProps = PropsWithChildren<ViewProps>;

export function PageContainer({ children, style, ...viewProps }: PageContainerProps) {
  const { width } = useWindowDimensions();
  const maxWidth =
    width >= PAGE_LAYOUT.desktopBreakpoint
      ? PAGE_LAYOUT.desktopMaxWidth
      : PAGE_LAYOUT.mobileMaxWidth;

  return (
    <View {...viewProps} style={[styles.container, { maxWidth }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingHorizontal: PAGE_LAYOUT.horizontalPadding,
    width: '100%',
  },
});
