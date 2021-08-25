import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BUTTON_HEIGHT, COLORS, FONTS, FONT_SIZE } from 'res/constants';
import { COLOR } from 'res/variables';
import { scale } from 'toktokfood/helper/scale';

export const SubmitButton = () => {
  return (
    <TouchableOpacity style={styles.submitRatingButton} onPress={() => {}}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitRatingButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_HEIGHT,
    backgroundColor: COLOR.YELLOW,
    marginVertical: scale(15),
    marginHorizontal: 16,
  },
  buttonText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONTS.BOLD,
  },
});
