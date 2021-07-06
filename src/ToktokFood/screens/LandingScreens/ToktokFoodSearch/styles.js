import {StyleSheet} from 'react-native';
import {COLOR, FONT} from 'res/variables';

// Utils
import {verticalScale, scale} from 'toktokfood/helper/scale';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  listContainer: {
    flex: 1,
    paddingVertical: 15,
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
    height: 75,
    width: 78,
    borderRadius: 12,
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
    marginTop: 12,
    paddingHorizontal: 10,
  },
});
