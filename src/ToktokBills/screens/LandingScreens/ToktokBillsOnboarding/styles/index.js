import {StyleSheet, Dimensions} from 'react-native';

//HELPER
import {moderateScale} from 'toktokbills/helper';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'transparent',
    width: width,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: moderateScale(15),
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(30),
    color: COLOR.ORANGE,
    textAlign: 'center',
  },
  wallet: {
    marginBottom: moderateScale(20),
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(30),
    color: COLOR.YELLOW,
    textAlign: 'center',
  },
  onboardingImage1: {
    height: null,
    aspectRatio: 1.1,
    width: width * 0.8,
    marginVertical: 10,
  },
  onboardingImage2: {
    height: null,
    aspectRatio: 1.2,
    width: width * 0.8,
    marginVertical: 10,
  },
  logo: {
    height: moderateScale(50),
    width: moderateScale(150),
    marginVertical: 10,
  },
  message: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginHorizontal: moderateScale(20),
  },
});
