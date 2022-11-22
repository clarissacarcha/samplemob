import React from 'react';
import {StyleSheet, Text} from 'react-native';
import normalize from 'react-native-normalize';
import CONSTANTS from '../../common/res/constants';
import {ThrottledOpacity} from '../ThrottledOpacity';

export const PrimaryButton = ({label, buttonStyle, textStyle}) => {
  return (
    <ThrottledOpacity style={[styles.button, {...buttonStyle}]}>
      <Text style={[styles.text, {...textStyle}]}>{label}</Text>
    </ThrottledOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  text: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: normalize(15),
    color: CONSTANTS.COLOR.WHITE,
  },
});
