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

const processErrorMessage = (fieldValue, fieldName, fieldWidth, fieldType, minWidth) => {
  // 0 = min | 1 = exact | 2 = max

  if (fieldValue.length < minWidth) {
    return `${fieldName} must be minimum of ${minWidth} characters.`;
  }
  switch (fieldType) {
    case 0:
      return fieldValue.length < fieldWidth ? `${fieldName} must be minimum of ${fieldWidth} characters.` : '';
    case 1:
      return fieldValue.length < fieldWidth ? `${fieldName} must be ${fieldWidth} characters in length.` : '';
    case 2:
      return fieldValue.length > fieldWidth ? `${fieldName} length must be ${fieldWidth} characters or less.` : '';

    default:
      return '';
  }
};

export const ConfirmButton = ({billType, billItemSettings = {}, tokwaBalance}) => {
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
    itemDocumentDetails,
    providerId,
  } = billItemSettings;

  const {user} = useSelector(state => state.session);
  const {termsAndConditions, paymentPolicy1, paymentPolicy2} = itemDocumentDetails;

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

  const checkFirstField = () => {
    const errorMessage = processErrorMessage(
      (fieldValue = firstField),
      firstFieldName,
      firstFieldWidth,
      firstFieldWidthType,
      firstFieldMinWidth,
    );
    firstField ? setFirstFieldError(errorMessage) : setFirstFieldError('This is a required field.');
  };

  const checkSecondField = () => {
    const errorMessage = processErrorMessage(
      (fieldValue = secondField),
      firstFieldName,
      firstFieldWidth,
      firstFieldWidthType,
      firstFieldMinWidth,
    );
    secondField ? setSecondFieldError(errorMessage) : setSecondFieldError('This is a required field.');
  };

  const checkEmail = () => {
    if (email != '' && !validator.isEmail(email, {ignore_whitespace: true})) {
      setEmailError('Invalid email format.o');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const checkAmount = () => {
    if (amount == '') {
      setAmountError('This is a required field.');
    } else {
      setAmountError('');
    }
  };

  const checkInsufficientBalance = () => {
    const totalAmount = parseFloat(convenienceFee) + parseFloat(amount);
    setIsInsufficientBalance(parseFloat(totalAmount) > parseFloat(tokwaBalance));
  };

  const onPressConfirm = () => {
    checkFirstField();
    checkSecondField();
    checkAmount();
    checkInsufficientBalance();

    const isValidEmail = checkEmail();
    const isProceed = checkProceed();

    if (isProceed && isValidEmail) {
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

  const checkProceed = () => {
    return (
      user.toktokWalletAccountId &&
      !isInsufficientBalance &&
      !firstFieldError &&
      firstField &&
      !secondFieldError &&
      secondField &&
      !amountError &&
      amount &&
      !emailError
    );
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <OrangeButton onPress={onPressConfirm} label="Confirm" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  terms: {
    textAlign: 'center',
    marginBottom: moderateScale(15),
  },
  tnc: {
    color: '#F6841F',
  },
  paymentPolicy1: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
    marginBottom: moderateScale(15),
  },
  paymentPolicy2: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
});
