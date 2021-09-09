import {StyleSheet, Platform} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

// Utils
import {getStatusbarHeight, verticalScale} from 'toktokfood/helper/scale';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: Platform.OS === 'android' ? getStatusbarHeight : 0,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    paddingHorizontal: 20,
    borderBottomColor: COLOR.LIGHT,
    height: verticalScale(60),
  },
  headerLabel: {
    color: COLOR.BLACK,
    textAlign: 'center',
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
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
