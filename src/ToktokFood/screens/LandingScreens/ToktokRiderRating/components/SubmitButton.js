import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BUTTON_HEIGHT, COLORS, FONTS, FONT_SIZE } from 'res/constants';
import { COLOR } from 'res/variables';
import { scale } from 'toktokfood/helper/scale';
import { VerifyContext } from '../components';

export const SubmitButton = () => {
  const {
    rating,
    toktokwalletBalance,
    activeTab,
    otherAmount,
    rateComments,
    errorAmountMessage,
    setErrorAmountMessage,
  } = useContext(VerifyContext);
  const tokwaBalance = parseFloat(toktokwalletBalance);

  const onPressSubmit = () => {
    if (errorAmountMessage) return;
    if (tokwaBalance > 20 && tokwaBalance < 20 && otherAmount == '') {
      return setErrorAmountMessage('Enter other amount is required.');
    }
    let hasToktokWalletBalance = tokwaBalance > 0;
    let hasSelectedAmount = hasToktokWalletBalance ? activeTab : 0;
    let hasOtherAmount = otherAmount != '' ? parseFloat(otherAmount).toFixed(2) : '0.00';
    let tip = hasSelectedAmount ? hasSelectedAmount : hasOtherAmount;

    let data = {
      rating,
      tip,
      rateComments,
    };
  };

  return (
    <TouchableOpacity style={styles.submitRatingButton} onPress={onPressSubmit}>
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
