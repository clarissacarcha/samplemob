import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK, COLOR_UNDERLAY, FONT_REGULAR, FONT_MEDIUM, FONT_BOLD, FONT_SEMIBOLD} from '../../res/constants';

export const BlackButton = ({label, onPress, style, touchableStyle = {}}) => {
  return (
    <TouchableHighlight onPress={onPress} style={[styles.blackButton, touchableStyle]} underlayColor={COLOR}>
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
    backgroundColor: DARK,
    borderRadius: 5,
  },
  label: {
    color: COLOR,
    fontSize: 14,
    paddingHorizontal: 10,
    fontFamily: FONT_MEDIUM,
  },
});
