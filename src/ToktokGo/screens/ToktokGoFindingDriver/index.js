import React from 'react';
import {View, StyleSheet} from 'react-native';
import constants from '../../../common/res/constants';
import {
  BackButton,
  FindingDriverStatus,
  BookingDistanceTime,
  DistanceOriginAddress,
  TotalBreakdown,
  CancelRetryButton,
} from './Sections';

const ToktokGoFindingDriver = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: constants.COLOR.WHITE}}>
      <BackButton navigation={navigation} />
      <FindingDriverStatus />

      <View style={styles.card}>
        <BookingDistanceTime />
        <DistanceOriginAddress />
        <TotalBreakdown />
        <CancelRetryButton />
      </View>
    </View>
  );
};

export default ToktokGoFindingDriver;

const styles = StyleSheet.create({
  card: {
    right: -4.5,
    width: '102%',
    borderWidth: 3,
    borderTopColor: constants.COLOR.ORANGE,
    borderLeftColor: constants.COLOR.ORANGE,
    borderRightColor: constants.COLOR.ORANGE,

    position: 'absolute',
    paddingTop: 13,
    paddingHorizontal: 16,
    bottom: 0,
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    marginTop: 8,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
});
