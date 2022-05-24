import React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import FIcon from 'react-native-vector-icons/Fontisto';
import moment from 'moment';
import {useSelector} from 'react-redux';

export const BookingDistanceTime = ({quotationData, loading}) => {
  const minDuration = quotationData.route?.duration.minute;
  const maxTime = moment().add(minDuration, 'minutes').format('hh:mm A');
  const minTime = moment().format('hh:mm A');

  const {details} = useSelector(state => state.toktokGo);
  return (
    <>
      <View style={styles.container}>
        <View>
          <View style={styles.elementWrapper}>
            {loading ? (
              <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
            ) : (
              <>
                <FIcon name={'clock'} size={CONSTANTS.FONT_SIZE.M} style={{color: CONSTANTS.COLOR.YELLOW}} />
                <Text style={styles.textStyle}>{details?.rate?.initialDropOffTimeFrame}</Text>
              </>
            )}
          </View>
          <Text style={styles.bottomTextStyle}>Estimated Time of Drop-off</Text>
        </View>
      </View>

      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  elementWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
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
});
