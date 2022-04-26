import {StyleSheet, Platform} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

// Utils
import {getStatusbarHeight, getDeviceHeight, moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';

const styles = StyleSheet.create({
  btnContainer: {
    paddingTop: 20,
  },
  btnStyle: {
    width: 150,
    borderRadius: 5,
    height: 35,
    backgroundColor: '#F6841F',
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: Platform.OS === 'android' ? getStatusbarHeight : 0,
  },
  closedTag: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#F6841F',
    padding: 3,
  },
  closedText: {
    color: '#F6841F',
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    paddingTop: verticalScale(80),
  },
  emptyShop: {
    height: moderateScale(191),
    width: moderateScale(198),
  },
  emptyTextTitle: {
    color: '#F6841F',
    fontSize: 17,
    marginTop: moderateScale(20),
    fontWeight: '700',
  },
  emptyText: {
    fontSize: FONT_SIZE.M,
    textAlign: 'center',
    marginTop: moderateScale(5),
    marginHorizontal: moderateScale(20),
    color: '#000',
  },
  emptyImg: {
    height: moderateScale(175),
    width: moderateScale(250),
  },
  listContainer: {
    flex: 1,
    // paddingVertical: 15,
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 3,
    paddingHorizontal: 20,
    borderBottomColor: COLOR.LIGHT,
    height: verticalScale(50),
  },
  headerLabel: {
    color: COLOR.BLACK,
    textAlign: 'center',
    flex: 1,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
  },
  img: {
    borderRadius: 10,
    marginRight: 10,
    width: 70,
    height: 70,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#F8F8F8',
    flexDirection: 'row',
    paddingVertical: 15,
  },
  notificationItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoWrapper: {
    flex: 1,
    marginStart: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.LIGHT,
    paddingVertical: verticalScale(14),
  },
  loaderStyle: {
    flex: 1,
  },
  loaderContainer: {
    justifyContent: 'center',
    flex: 1,
    height: getDeviceHeight / 1.5,
  },
  shopDetails: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  shopName: {
    fontSize: 13,
    fontWeight: '700',
  },
  subInfoText: {
    paddingHorizontal: 8,
  },
  timeImg: {
    width: scale(13),
    height: scale(13),
    tintColor: COLOR.PRIMARY,
    resizeMode: 'contain',
  },
});

export default styles;
