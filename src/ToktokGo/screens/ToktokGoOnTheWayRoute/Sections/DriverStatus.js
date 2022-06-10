import moment from 'moment';
import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import constants from '../../../../common/res/constants';

export const DriverStatus = ({status, booking}) => {
  console.log(booking.estimates);
  return (
    <View>
      {booking.status == 'ACCEPTED' && (
        <View style={styles.Mins}>
          <Text style={{fontFamily: constants.FONT_FAMILY.SEMI_BOLD, fontSize: constants.FONT_SIZE.M}}>
            {Math.abs(moment().diff(moment(booking.estimates.pickUpAt), 'minutes', false))} mins
          </Text>
          <Text style={{fontSize: constants.FONT_SIZE.S, color: '#525252'}}>Your driver is on the way</Text>
        </View>
      )}
      {status == 1 && (
        <View style={styles.Mins}>
          <Text style={{fontFamily: constants.FONT_FAMILY.SEMI_BOLD, fontSize: constants.FONT_SIZE.M}}>
            {moment().diff(booking.estimates.pickUpAt, 'minutes', false)} min
          </Text>
          <Text style={{fontSize: constants.FONT_SIZE.S, color: '#525252'}}>Your driver is nearby</Text>
        </View>
      )}
      {booking.status == 'ARRIVED' && (
        <View style={styles.Mins}>
          <Text style={{fontFamily: constants.FONT_FAMILY.SEMI_BOLD, fontSize: constants.FONT_SIZE.M}}>
            {moment().diff(booking.estimates.pickUpAt, 'minutes', false)} min
          </Text>
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
