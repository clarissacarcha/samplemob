import React from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import ContentLoader from 'react-native-easy-content-loader';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {markerIcon} from 'toktokfood/assets/images';

import {getStatusbarHeight, verticalScale, moderateScale, getDeviceWidth} from 'toktokfood/helper/scale';

const YellowButton = ({ onPress, label, disabled, btnStyle }) => {
  const backgroundColor = disabled ? { backgroundColor: 'lightgray'} : {};
  const colorText =  disabled ? { color: 'gray'} : {};

  return (
    <TouchableOpacity disabled={disabled} style={[styles.btn, backgroundColor, btnStyle]} onPress={onPress}>
      <Text style={[styles.buttonText, colorText]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default YellowButton;

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    width: getDeviceWidth - 28,
    backgroundColor: '#FFA700',
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});
