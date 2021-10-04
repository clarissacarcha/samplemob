import {StyleSheet} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

// Utils
import {verticalScale, scale, moderateScale} from 'toktokfood/helper/scale';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  listContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 15,
  },
  itemContainer: {
    width: scale(350),
    alignSelf: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderColor: '#E6E6E6',
    paddingVertical: verticalScale(8),
  },
  imgWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  branchWrapper: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  branchText: {
    color: COLOR.ORANGE,
    paddingHorizontal: 3,
  },
  img: {
    height: 64,
    width: 64,
    borderRadius: 7,
  },
  restaurantInfo: {
    paddingEnd: 8,
    paddingStart: 10,
    color: COLOR.BLACK,
  },
  restaurantName: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
  },
  ratings: {
    marginTop: 4,
    alignItems: 'flex-start',
  },
  infoWrapper: {
    paddingEnd: 10,
    width: scale(250),
  },
  subInfoWrapper: {
    marginTop: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  subInfoText: {
    paddingHorizontal: 3,
  },
  tabContainer: {
    marginTop: 18,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    paddingTop: verticalScale(80)
  },
  emptyImg: {
    height: moderateScale(175),
    width: moderateScale(250),
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: FONT_SIZE.L,
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(50),
    textAlign: 'center'
  },
});
