import React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import CONSTANTS from '../../../../common/res/constants';
import FIcon from 'react-native-vector-icons/Fontisto';
import moment from 'moment';
import {useSelector} from 'react-redux';

export const BookingDistanceTime = ({quotationData, loading}) => {
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const minDuration = quotationData.route?.duration.minute;
  const maxTime = moment().add(minDuration, 'minutes').format('hh:mm A');
  const minTime = moment().format('hh:mm A');

  const {details} = useSelector(state => state.toktokGo);
  return (
    <>
      <View style={styles.container}>
        <ShimmerPlaceHolder
          style={{
            width: !loading ? 150 : 138,
            height: !loading ? 28 : 16,
          }}
          visible={!loading}>
          <View style={styles.elementWrapper}>
            <>
              <FIcon name={'clock'} size={CONSTANTS.FONT_SIZE.M} style={{color: CONSTANTS.COLOR.YELLOW}} />
              <Text style={styles.textStyle}>{details?.rate?.initialDropOffTimeFrame}</Text>
            </>
          </View>
          <Text style={styles.bottomTextStyle}>Estimated Time of Drop-off</Text>
        </ShimmerPlaceHolder>
        <ShimmerPlaceHolder style={styles.shimmer} visible={!loading} />
      </View>
      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 30,
    alignItems: 'center',
    flexDirection: 'column',
  },
  elementWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.BLACK,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginLeft: 10,
  },
  bottomTextStyle: {
    color: CONSTANTS.COLOR.DARK,
    fontSize: CONSTANTS.FONT_SIZE.S,
    marginLeft: 10,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginVertical: 16,
    marginHorizontal: -16,
  },
  shimmer: {
    width: 136,
    height: 13,
    marginTop: 2,
  },
});
