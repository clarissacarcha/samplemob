import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from '../../res/variables';

export const BlackButton = ({label, onPress, style, touchableStyle = {}}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.blackButton, touchableStyle]}
      underlayColor={COLOR.YELLOW_UNDERLAY}>
      <View style={[styles.blackButtonBox, style]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  blackButton: {
    borderRadius: 5,
  },
  blackButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: COLOR.YELLOW,
    borderRadius: 5,
  },
  label: {
    color: COLOR.DARK,
    paddingHorizontal: 10,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
  },
});
