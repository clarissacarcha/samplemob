import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import constants from '../../../../common/res/constants';
import FIcon from 'react-native-vector-icons/Fontisto';

export const DriverStatusDestination = ({status}) => {
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
            03:00 PM - 03:15 PM
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
