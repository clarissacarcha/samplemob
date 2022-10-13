import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {moderateScale} from 'toktokbills/helper';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
const {COLOR} = CONSTANTS;
import {throttle} from 'lodash';

export const HeaderRight = ({onPress, isFavorite = false}) => {
  const onPressThrottle = throttle(
    () => {
      onPress();
    },
    1000,
    {trailing: false},
  );

  return (
    <TouchableOpacity style={[styles.header]} onPress={onPressThrottle}>
      <FIcon5 name={isFavorite ? 'heart' : 'heart-o'} color={COLOR.ORANGE} size={moderateScale(17)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingRight: moderateScale(16),
  },
});
