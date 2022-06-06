import React, {useContext, useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//UTIL
//HELPER
import {
  moderateScale,
  formatAmount,
  numberFormat,
  numericRegex,
  alphanumericRegex,
  maxLengthRegex,
  minLengthRegex,
  currencyCode,
} from 'toktokbills/helper';
import {ErrorUtility} from 'toktokbills/util';
import validator from 'validator';

//COMPONENTS
import {OrangeButton} from 'toktokbills/components';
import {AlertOverlay} from 'src/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {VerifyContext} from '../VerifyContextProvider';

//GRAPHQL & HOOKS
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_BILLS_VALIDATE_TRANSACTION} from 'toktokbills/graphql/model';
import {useAccount} from 'toktokwallet/hooks';
import {usePrompt, useThrottle} from 'src/hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useSelector} from 'react-redux';
import {checkFirstField, checkSecondField} from '../../Functions';

export const ConfirmButton = ({billType, billItemSettings = {}, tokwaBalance, scrollRef = {}, getMyAccount}) => {
  const prompt = usePrompt();
  const navigation = useNavigation();
  const {
    amount,
    setAmount,
    amountError,
    setAmountError,
    email,
    setEmail,
    emailError,
    setEmailError,
    firstField,
    setFirstField,
    firstFieldError,
    setFirstFieldError,
    isInsufficientBalance,
    setIsInsufficientBalance,
    secondField,
    setSecondField,
    secondFieldError,
    setSecondFieldError,
  } = useContext(VerifyContext);
  const {
    firstFieldName,
    firstFieldFormat,
    firstFieldWidth,
    firstFieldWidthType,
    firstFieldMinWidth,
    secondFieldName,
    secondFieldFormat,
    secondFieldWidth,
    secondFieldWidthType,
    secondFieldMinWidth,
    commissionRateDetails,
    providerId,
  } = billItemSettings;

  const {user} = useSelector(state => state.session);

  //CONVENIENCE FEE
  const convenienceFee =
    parseFloat(commissionRateDetails?.providerServiceFee) + parseFloat(commissionRateDetails?.systemServiceFee);

  const [postBillsValidateTransaction, {loading, error}] = useMutation(POST_BILLS_VALIDATE_TRANSACTION, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: 'Invalid Data',
      });
    },
    onCompleted: ({postBillsValidateTransaction}) => {
      let {ReferenceNumber} = postBillsValidateTransaction;
      let paymentData = {
        firstField,
        secondField,
        amount,
        email,
        billType,
        convenienceFee,
        billItemSettings,
        referenceNumber: ReferenceNumber,
      };
      navigation.navigate('ToktokBillsPaymentSummary', {paymentData});
    },
  });

  const checkEmail = () => {
    if (email != '' && !validator.isEmail(email, {ignore_whitespace: true})) {
      setEmailError('Invalid email address format');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const checkAmount = () => {
    let error = amount == '' ? 'This is a required field' : '';
    setAmountError(error);
    return !error;
  };

  const checkInsufficientBalance = () => {
    const totalAmount = parseFloat(convenienceFee) + parseFloat(amount);
    setIsInsufficientBalance(parseFloat(totalAmount) > parseFloat(tokwaBalance));
    return parseFloat(totalAmount) > parseFloat(tokwaBalance);
  };

  const onPressConfirm = () => {
    // setRefreshing(true)
    getMyAccount();
    const isFirstFieldValid = checkFirstField(
      firstField,
      firstFieldName,
      firstFieldWidth,
      firstFieldWidthType,
      firstFieldMinWidth,
      setFirstFieldError,
    );
    const isSecondFieldValid = checkSecondField(
      secondField,
      secondFieldName,
      secondFieldWidth,
      secondFieldWidthType,
      secondFieldMinWidth,
      setSecondFieldError,
    );
    const isAmountValid = checkAmount();
    const isInsufficientBalance = checkInsufficientBalance();
    const isValidEmail = checkEmail();

    if (isInsufficientBalance && isFirstFieldValid && isSecondFieldValid) {
      scrollRef.current.scrollToEnd({animated: true});
    }

    if (
      user.toktokWalletAccountId &&
      isFirstFieldValid &&
      isSecondFieldValid &&
      isAmountValid &&
      !isInsufficientBalance &&
      isValidEmail
    ) {
      postBillsValidateTransaction({
        variables: {
          input: {
            name: billItemSettings.name,
            destinationNumber: firstField,
            destinationIdentifier: secondField,
            amount: parseFloat(amount),
            providerId,
          },
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <OrangeButton onPress={onPressConfirm} label="Next" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
});
