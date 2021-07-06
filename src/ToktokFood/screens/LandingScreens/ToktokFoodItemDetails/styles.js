import {StyleSheet, Platform} from 'react-native';
import {FONT, FONT_SIZE, COLOR} from 'res/variables';
// Utils
import {scale, moderateScale, verticalScale} from 'toktokfood/helper/scale';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  foodDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(3),
  },
  foodName: {
    fontSize: FONT_SIZE.XL,
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
  },
  foodPrice: {
    marginEnd: 3,
    color: COLOR.ORANGE,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
  },
  foodNameWrapper: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    width: Platform.OS === 'android' ? moderateScale(175) : moderateScale(170),
  },
  heart: {
    marginTop: Platform.OS === 'android' ? scale(4) : 0,
    marginStart: Platform.OS === 'android' ? 3 : scale(4),
  },
  banner: {
    marginTop: 10,
    borderRadius: 10,
    width: scale(345),
    height: scale(150),
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  ratings: {
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  foodContainer: {
    paddingBottom: 10,
    borderBottomWidth: 8,
    borderBottomColor: COLOR.LIGHT,
    paddingHorizontal: Platform.OS === 'android' ? 12 : 14,
  },
  ratingsWrapper: {
    paddingLeft: Platform.OS === 'android' ? 4 : 3,
  },
  description: {
    marginTop: 1,
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
});
