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
  },
  itemContainer: {
    marginHorizontal: moderateScale(16),
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
    justifyContent: 'center',
    paddingEnd: 8,
    paddingStart: 10,
    color: COLOR.BLACK,
  },
  restaurantName: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    marginBottom: 2,
  },
  restaurantTitle: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
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
    paddingHorizontal: 16,
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
    fontSize: FONT_SIZE.L,
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(50),
    textAlign: 'center',
  },
  ratingImg: {
    width: moderateScale(15),
    height: moderateScale(15),
    marginVertical: 5,
  },
  timeImg: {
    width: scale(13),
    height: scale(13),
    tintColor: COLOR.DARK,
    resizeMode: 'contain',
  },
  searchBoxContainer: {
    left: 0,
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
  },
  searchBox: {
    height: 49,
    width: '100%',
    paddingEnd: 10,
    borderRadius: 13,
    paddingStart: 42,
    backgroundColor: '#FFF',
  },
  searchBoxShadow: {
    shadowColor: '#949494',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInputFontStyles: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  textInputWrapper: {
    height: 50,
    width: '93%',
    display: 'flex',
    borderRadius: 13,
    position: 'relative',
    flexDirection: 'row',
  },
  searchBoxIcon: {
    left: 13,
    width: 20,
    height: 20,
    zIndex: 99,
    alignSelf: 'center',
    position: 'absolute',
  },
  placeholderText: {
    color: COLOR.DARK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    marginTop: Platform.OS === 'ios' ? 15 : 13,
  },
  historyContainer: {
    height: '100%',
  },
  historyTextClearWrapper: {
    marginEnd: scale(18),
    alignSelf: 'flex-end',
    marginVertical: verticalScale(12),
  },
  historyTextClear: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  historyListWrapper: {
    width: '100%',
    paddingHorizontal: scale(18),
  },
  historyItem: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 3,
    paddingVertical: verticalScale(18),
  },
  historyText: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    color: COLOR.BLACK,
  },
  footerText: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  footerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
    height: verticalScale(40),
  },
});
