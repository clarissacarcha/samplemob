import {StyleSheet, Platform} from 'react-native';
import {FONT, FONT_SIZE, COLOR, TOKFOODCOLOR} from 'res/variables';
// Utils
import {scale, moderateScale, verticalScale} from 'toktokfood/helper/scale';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  flex: {
    flex: 1,
  },
  foodDetails: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingVertical: verticalScale(3),
    marginTop: Platform.OS === 'android' ? verticalScale(8) : verticalScale(3),
  },
  foodName: {
    fontSize: FONT_SIZE.XL,
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    flex: 1,
    marginRight: moderateScale(5),
  },
  foodPrice: {
    // marginEnd: 3,
    color: '#FF6200',
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
    paddingVertical: 10,
    borderBottomWidth: 8,
    borderBottomColor: COLOR.LIGHT,
    paddingHorizontal: Platform.OS === 'android' ? 12 : 14,
    backgroundColor: 'white',
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
  resellerBadge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    height: 25,
    // width: 90,
    // borderWidth: 1,
    // backgroundColor: TOKFOODCOLOR.YELLOWBG,
    // borderRadius: 5,
    // padding: 3,
  },
  resellerPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resellerText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.S,
    fontWeight: '700',
  },
  resellerDiscountText: {
    color: TOKFOODCOLOR.GRAY,
    // fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
    textAlign: 'right',
    textDecorationLine: 'line-through',
    marginLeft: moderateScale(8),
  },
});
export default styles;
