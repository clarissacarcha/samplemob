import {StyleSheet, Platform} from 'react-native';
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {COLORS} from 'res/constants';

// Utils
import {scale, verticalScale, moderateScale, getDeviceWidth} from 'toktokfood/helper/scale';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  sectionContainer: {
    paddingBottom: 10,
    borderBottomWidth: 8,
    borderBottomColor: COLOR.LIGHT,
    paddingHorizontal: Platform.OS === 'android' ? 12 : 14,
  },
  scrollView: {paddingBottom: 150},
  deliverWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10)
  },
  sectionTitle: {
    fontSize: FONT_SIZE.L,
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
  },
  actionText: {
    marginEnd: 3,
    color: COLOR.YELLOW,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  textAddressContainer: {
    maxWidth: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: verticalScale(14),
  },
  textAddress: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  addressMarkerIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  foodItemImage: {
    width: 80,
    height: 75,
    marginRight: 8,
    borderRadius: 12,
  },
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(18),
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
  },
  foodPrice: {
    marginEnd: 3,
    color: COLOR.ORANGE,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  priceWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  orderInfoWrapper: {
    flex: 1,
    minHeight: 90,
    paddingHorizontal: scale(6),
  },
  orderText: {
    color: COLOR.BLACK,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    marginVertical: verticalScale(1),
  },
  alsoOrderList: {
    flex: 1,
  },
  alsoOrderContainer: {
    marginEnd: 8,
    maxWidth: scale(98),
  },
  alsoOrderedItemImage: {
    width: 95,
    height: 85,
    borderRadius: 12,
  },
  alsoOrderedInfoWrapper: {
    flex: 1,
    marginVertical: verticalScale(6),
  },
  alsoOrderedTitle: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  ratings: {
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(5),
  },
  divider: {
    borderTopWidth: 0.5,
    borderColor: '#DDDDDD',
    marginVertical: verticalScale(6),
  },
  totalContainer: {
    paddingVertical: verticalScale(14),
  },
  total: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  subtotal: {
    fontFamily: FONT.BOLD,
    color: COLORS.ORANGE,
    fontSize: FONT_SIZE.L,
  },
  totalPrice: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
    color: COLORS.ORANGE,
  },
  paymentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 6,
  },
  tokwaButton: {
    marginEnd: 10,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLOR.YELLOW,
    height: moderateScale(50),
    width: moderateScale(150),
    paddingHorizontal: scale(6),
    backgroundColor: COLOR.WHITE,
  },
  tokwaButtonTextWrapper: {
    flexDirection: 'row',
  },
  toktokText: {
    color: COLOR.YELLOW,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.REGULAR,
  },
  walletText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.REGULAR,
  },
  walletIcon: {
    width: 32,
    height: 32,
    marginRight: 4,
  },
  cashButton: {
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLOR.MEDIUM,
    width: moderateScale(80),
    height: moderateScale(50),
    backgroundColor: COLOR.WHITE,
  },
  cashText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  input: {
    height: moderateScale(90),
    borderWidth: 1,
    borderRadius: 10,
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    borderColor: COLOR.MEDIUM,
    textAlignVertical: 'top',
    marginVertical: scale(6),
    paddingTop: 15,
    paddingHorizontal: scale(15),
  },
  placeOrderButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: COLOR.YELLOW,
    width: getDeviceWidth - 28,
    marginTop: scale(10)
  },
  buttonText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});
