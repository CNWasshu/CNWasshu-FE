import type { TextStyle } from 'react-native';
import { Text, TextInput } from 'react-native';

export const APP_FONTS = {
  regular: 'MapoBackpacking',
  medium: 'MapoBackpacking',
  semibold: 'MapoBackpacking',
  bold: 'MapoBackpacking',
} as const;

export const APP_FONT_ASSETS = {
  MapoBackpacking: require('@/assets/fonts/point/MapoBackpacking.otf'),
  KCCAhnjunggeun: require('@/assets/fonts/point/KCCAhnjunggeun.otf'),
};

export const APP_POINT_FONT = 'KCCAhnjunggeun';
export const APP_NAVIGATION_FONT = 'KCCAhnjunggeun';

type ComponentWithDefaultStyle = {
  defaultProps?: {
    style?: TextStyle | TextStyle[];
  };
};

let applied = false;

export function applyGlobalTypography() {
  if (applied) return;

  const defaultStyle: TextStyle = { fontFamily: APP_FONTS.regular };
  const textComponent = Text as unknown as ComponentWithDefaultStyle;
  const inputComponent = TextInput as unknown as ComponentWithDefaultStyle;

  textComponent.defaultProps = {
    ...textComponent.defaultProps,
    style: [defaultStyle, textComponent.defaultProps?.style].filter(Boolean) as TextStyle[],
  };
  inputComponent.defaultProps = {
    ...inputComponent.defaultProps,
    style: [defaultStyle, inputComponent.defaultProps?.style].filter(Boolean) as TextStyle[],
  };

  applied = true;
}
