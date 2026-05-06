import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design reference: 390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Scale based on screen width
export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

// Scale based on screen height
export const verticalScale = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

// Moderate scale — use this for font sizes and most UI elements
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Responsive font size with PixelRatio normalization
export const rf = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));

// Responsive spacing
export const rs = (size: number) => Math.round(scale(size));

// Responsive vertical spacing
export const rv = (size: number) => Math.round(verticalScale(size));

export const SCREEN_W = SCREEN_WIDTH;
export const SCREEN_H = SCREEN_HEIGHT;
export const isSmallDevice = SCREEN_HEIGHT < 700;
export const isLargeDevice = SCREEN_HEIGHT > 900;
