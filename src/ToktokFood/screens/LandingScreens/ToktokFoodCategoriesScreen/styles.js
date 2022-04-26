import {StyleSheet, Platform} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

// Utils
import {getStatusbarHeight, moderateScale, verticalScale} from 'toktokfood/helper/scale';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: Platform.OS === 'android' ? getStatusbarHeight : 0,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    paddingTop: verticalScale(80),
  },
  emptyImg: {
    height: moderateScale(175),
    width: moderateScale(250),
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: FONT_SIZE.XL,
    marginTop: moderateScale(20),
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
    alignItems: 'center',
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
  notificationInfo: {
    paddingEnd: 10,
  },
  notificationTitle: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  notificationContent: {
    marginTop: 2,
    color: COLOR.DARK,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  notificationIcon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.ORANGE,
  },
});

export default styles;
