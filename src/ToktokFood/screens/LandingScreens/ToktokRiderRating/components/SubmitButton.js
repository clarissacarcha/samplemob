import React, {useState, useContext} from 'react';
import {Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Rating} from 'react-native-ratings';
import {COLOR} from 'res/variables';
import {scale, getDeviceWidth} from 'toktokfood/helper/scale';
import {COLORS, FONTS, FONT_SIZE, BUTTON_HEIGHT} from 'res/constants';
import {VerifyContext} from '../components';
import RatingModal from 'toktokfood/components/RatingModal';
import {rider1} from 'toktokfood/assets/images';

export const SubmitButton = () => {
  const {
    riderInformation,
    rating,
    toktokwalletBalance,
    activeTab,
    otherAmount,
    rateComments,
    errorAmountMessage,
    setErrorAmountMessage,
  } = useContext(VerifyContext);
  const tokwaBalance = parseFloat(toktokwalletBalance);
  const [ratingModal, setRatingModal] = useState(false);

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
    setRatingModal(true)
  };

  return (
    <>
        <RatingModal
            title={"Rating Sent!"}
            visibility={ratingModal}
            onCloseModal={() => setRatingModal(false)}
            btnTitle="Confirm"
            imgSrc={rider1}
            rating={rating}
            readOnly
            showRating
        >
            <Text style={styles.messageTitle}>{riderInformation.name}</Text>
            <Text style={styles.messageContent}>{riderInformation.contactNo}</Text>
        </RatingModal>
        <TouchableOpacity style={styles.submitRatingButton} onPress={onPressSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
    submitRatingButton: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: BUTTON_HEIGHT,
        backgroundColor: "#FFA700",
        marginVertical: scale(15),
        marginHorizontal: 16,
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: FONT_SIZE.L,
        fontFamily: FONTS.BOLD,
    },
    messageTitle: {
        fontSize: FONT_SIZE.M, 
    },
    messageContent: {
        textAlign: 'center',
        fontSize: FONT_SIZE.M,
        fontFamily: FONTS.REGULAR,
        paddingBottom: 10
    },
});
