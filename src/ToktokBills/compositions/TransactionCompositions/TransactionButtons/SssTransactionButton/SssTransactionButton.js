/**
 * @format
 * @flow
 */

import React, {useContext} from 'react';

import type {PropsType} from './types';
import {} from './Styled';
import validator from 'validator';
//HELPER & UTIL
import {AmountLimitHelper} from 'toktokwallet/helper';
//COMPONENTS
import {OrangeButton} from 'toktokwallet/components';
import {TransactionVerifyContext} from '../../TransactionVerifyContextProvider';
//GRAPHQL & HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const SssTransactionButton = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.session);
  const {tokwaAccount, getMyAccount} = useAccount({isOnErrorAlert: false});
  const {billItemSettings, billType, itemCode} = props;
  const {
    processErrorMessage,
    data,
    fees,
    changeDataValue,
    changeErrorMessages,
    setIsInsufficientBalance,
    checkIsValidField,
    isFieldRequired,
  } = useContext(TransactionVerifyContext);
  const {amount, emailAddress, accountName, accountNumber, purpose} = data;
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

  //CONVENIENCE FEE
  const totalServiceFee =
    parseFloat(commissionRateDetails?.providerServiceFee) + parseFloat(commissionRateDetails?.systemServiceFee);
  const tokwaBalance = user.toktokWalletAccountId ? tokwaAccount?.wallet?.balance : '0.00';

  const checkEmail = () => {
    let error = emailAddress === '' ? 'This is a required field' : '';
    if (error === '' && !validator.isEmail(emailAddress, {ignore_whitespace: true})) {
      error = 'Invalid email address format';
    }
    changeErrorMessages('emailAddress', error);
    return !error;
  };

  const checkAmount = () => {
    let error = amount === '' ? 'This is a required field' : '';
    if (+amount < 1 && amount !== '') {
      error = 'The minimum amount allowed to pay is ₱1';
    }
    if (error === '') {
      return !checkInsufficientBalance();
    }
    changeErrorMessages('amount', error);
    return !error;
  };

  const checkInsufficientBalance = () => {
    const totalAmount = parseFloat(totalServiceFee) + parseFloat(amount);
    setIsInsufficientBalance(parseFloat(totalAmount) > parseFloat(tokwaBalance));
    return parseFloat(totalAmount) > parseFloat(tokwaBalance);
  };

  const onPressProceed = async () => {
    if (user.toktokWalletAccountId) {
      getMyAccount();
    }

    const isFirstFieldValid = checkIsValidField(
      'firstField',
      data.firstField,
      'Payment Reference Number (PRN)',
      14,
      1,
      null,
    );
    const isPayorTypeValid = isFieldRequired('payorTypeName', data.payorTypeName, 'selection');
    const isSecondFieldValid = checkIsValidField('secondField', data.secondField, 'Customer Name', 30, 2, null);
    const isAmountValid = checkAmount();
    const isValidEmail = checkEmail();

    if (isFirstFieldValid && isPayorTypeValid && isSecondFieldValid && isAmountValid && isValidEmail) {
      const paymentData = {
        ...data,
        billItemSettings,
        billType,
        itemCode,
        providerServiceFee: commissionRateDetails?.providerServiceFee,
        systemServiceFee: commissionRateDetails?.systemServiceFee,
        totalServiceFee: totalServiceFee,
      };

      navigation.navigate('ToktokBillsPaymentSummary', {
        paymentData,
      });
    }
  };

  return <OrangeButton label="Next" onPress={onPressProceed} hasShadow />;
};

export default SssTransactionButton;
