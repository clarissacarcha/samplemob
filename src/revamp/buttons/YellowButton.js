import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK, COLOR_UNDERLAY, FONT_REGULAR, FONT_MEDIUM, COLORS, SIZES, FONTS} from '../../res/constants';

export const YellowButton = ({label, onPress, style}) => {
  return (
    <TouchableHighlight onPress={onPress} style={styles.blackButton} underlayColor={"white"}>
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
    backgroundColor: COLORS.YELLOW,
    borderRadius: 5,
  },
  label: {
    color: "black",
    fontSize: SIZES.L ,
    paddingHorizontal: 10,
    fontFamily: FONTS.BOLD,
  },
});
