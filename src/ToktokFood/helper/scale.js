import {Dimensions, Platform, StatusBar} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const {width, height} = Dimensions.get('window');

const getDeviceWidth = width;
const getDeviceHeight = height;
const getStatusbarHeight = StatusBar.currentHeight;
const getIphoneNotchSize = getStatusBarHeight();

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const isIphoneXorAbove = () => {
  return Platform.OS === 'ios' && height >= 812;
};

const isIphoneHasNotch = () => {
  return Platform.OS === "ios" && getStatusBarHeight() > 24;
};

export {
  scale,
  verticalScale,
  moderateScale,
  getDeviceWidth,
  getDeviceHeight,
  isIphoneXorAbove,
  getStatusbarHeight,
  getIphoneNotchSize,
  isIphoneHasNotch
};
