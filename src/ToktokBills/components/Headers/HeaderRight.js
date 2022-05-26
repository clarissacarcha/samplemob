import React from 'react';
import {View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokbills/helper';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const HeaderRight = ({onPress, isFavorite = false}) => {
  return (
    <TouchableOpacity style={[styles.header]} onPress={onPress}>
      <FIcon5 name={isFavorite ? 'heart' : 'heart-o'} color={COLOR.ORANGE} size={moderateScale(17)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingRight: moderateScale(16),
  },
});
