import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Reference iPhone X screen
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Extra helpers
export const responsiveFont = (fontSize: number) =>
  Math.round(PixelRatio.roundToNearestPixel(scale(fontSize)));

export const screenWidth = width;
export const screenHeight = height;
