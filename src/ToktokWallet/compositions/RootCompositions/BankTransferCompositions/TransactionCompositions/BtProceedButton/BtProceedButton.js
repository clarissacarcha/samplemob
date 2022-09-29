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
import {BtVerifyContext} from '../BtVerifyContextProvider';
//GRAPHQL & HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useNavigation} from '@react-navigation/native';

const BtProceedButton = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const {tokwaAccount} = useAccount({isOnErrorAlert: false});
  const {bankDetails, screenLabel} = props;
  const {data, fees, changeDataValue, changeErrorMessages, computeConvenienceFeeLoading} = useContext(BtVerifyContext);
  const {amount, emailAddress, accountName, accountNumber, purpose} = data;

  const isRequired = (key, value) => {
    let error = value === '' ? 'This is a required field' : '';
    changeErrorMessages(key, error);
    return !error;
  };

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
      error = 'The minimum amount allowed to cash out is ₱1';
    }
    if (error === '') {
      return checkInsufficientBalance();
    }
    changeErrorMessages('amount', error);
    return !error;
  };

  const checkInsufficientBalance = () => {
    let totalAmount = fees.totalServiceFee + parseFloat(amount);
    let isInsufficientBalance = parseFloat(totalAmount) > parseFloat(tokwaAccount?.wallet?.transferableBalance);
    // let isMaxAmount = parseFloat(amount) > parseFloat(10);
    let error = '';

    // if (isMaxAmount) {
    //   error = `The maximum amount allowed to cash out is up to ₱${numberFormat(10).replace('.00', '')}`;
    // } else
    if (isInsufficientBalance) {
      error = 'You have insufficient balance. Kindly cash in or enter lower amount.';
    } else {
      error = '';
    }
    changeErrorMessages('amount', error);
    return !error;
  };

  const checkAccountNumber = () => {
    let error = data.accountNumber === '' ? 'This is a required field' : '';
    if (fees.type === 'Pesonet' && data.accountNumber.length > 16) {
      error = 'Account Number maximum length must be 16';
    }
    changeErrorMessages('accountNumber', error);
    return !error;
  };

  const onPressProceed = async () => {
    const isAccountNameValid = isRequired('accountName', accountName);
    const isAccountNumValid = checkAccountNumber();
    const isAmountValid = checkAmount();
    const isValidEmail = checkEmail();

    const checkLimit = await AmountLimitHelper.postCheckOutgoingLimit({
      amount,
      setErrorMessage: error => {
        changeErrorMessages('amount', error);
      },
    });

    if (
      isAccountNameValid &&
      isAccountNumValid &&
      isAmountValid &&
      isValidEmail &&
      checkLimit &&
      !computeConvenienceFeeLoading
    ) {
      const transactionDetails = {
        accountName,
        accountNumber,
        emailAddress,
        bankDetails,
        purpose: purpose.trim(),
        providerServiceFee: fees.providerServiceFee,
        systemServiceFee: fees.systemServiceFee,
        totalServiceFee: fees.totalServiceFee,
        type: fees.type,
        amount: parseFloat(amount),
      };
      changeDataValue('purpose', purpose.trim());
      navigation.navigate('ToktokWalletBankTransferPaymentSummary', {
        transactionDetails,
        screenLabel,
      });
    }
  };

  return <OrangeButton label="Proceed" onPress={onPressProceed} hasShadow />;
};

export default BtProceedButton;
