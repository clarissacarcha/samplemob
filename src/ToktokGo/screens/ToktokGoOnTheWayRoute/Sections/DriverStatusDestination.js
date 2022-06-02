import React, {useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import constants from '../../../../common/res/constants';
import FIcon from 'react-native-vector-icons/Fontisto';
import moment from 'moment';

export const DriverStatusDestination = ({status, booking}) => {
  const minDuration = booking.route?.duration.minute;
  const [createdAtTime, setCreatedAtTime] = useState(booking?.logs[0]?.createdAt);
  const maxTime = moment(createdAtTime).add(minDuration, 'minutes').format('hh:mm A');
  const minTime = moment(createdAtTime).format('hh:mm A');

  return (
    <View>
      <View style={styles.Mins}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FIcon
            name={'clock'}
            size={constants.FONT_SIZE.M}
            style={{color: constants.COLOR.YELLOW, paddingRight: 10}}
          />
          <Text style={{fontSize: constants.FONT_SIZE.M, fontFamily: constants.FONT_FAMILY.BOLD}}>
            {booking?.estimates?.dropOffTimeFrame}
          </Text>
        </View>
        <Text style={{fontSize: constants.FONT_SIZE.S, color: '#525252'}}>Estimated Time of Drop Off</Text>
      </View>
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
