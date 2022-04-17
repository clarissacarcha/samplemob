import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import constants from '../../../../common/res/constants';

export const DriverStatus = ({status, booking}) => {
  return (
    <View>
      {booking.status == 'ACCEPTED' && (
        <View style={styles.Mins}>
          <Text style={{fontFamily: constants.FONT_FAMILY.BOLD, fontSize: constants.FONT_SIZE.M}}>5 mins</Text>
          <Text style={{fontSize: constants.FONT_SIZE.S, color: '#525252'}}>Your driver is on the way</Text>
        </View>
      )}
      {status == 1 && (
        <View style={styles.Mins}>
          <Text style={{fontFamily: constants.FONT_FAMILY.BOLD, fontSize: constants.FONT_SIZE.M}}>1 min</Text>
          <Text style={{fontSize: constants.FONT_SIZE.S, color: '#525252'}}>Your driver is nearby</Text>
        </View>
      )}
      {booking.status == 'ARRIVED' && (
        <View style={styles.Mins}>
          <Text style={{fontFamily: constants.FONT_FAMILY.BOLD, fontSize: constants.FONT_SIZE.M}}>0 min</Text>
          <Text style={{fontSize: constants.FONT_SIZE.S, color: '#525252'}}>Your driver has arrived</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Mins: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});
