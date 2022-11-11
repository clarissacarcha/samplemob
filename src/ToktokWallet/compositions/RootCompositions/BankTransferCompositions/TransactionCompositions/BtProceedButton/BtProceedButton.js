/**
 * @format
 * @flow
 */

import React, {useContext, useState} from 'react';

import type {PropsType} from './types';
import {} from './Styled';
import validator from 'validator';
//HELPER & UTIL
import {AmountLimitHelper} from 'toktokwallet/helper';
//COMPONENTS
import {OrangeButton} from 'toktokwallet/components';
import {BtVerifyContext} from '../BtVerifyContextProvider';
import {AlertOverlay} from 'src/components';
//GRAPHQL & HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useNavigation} from '@react-navigation/native';

const BtProceedButton = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const {tokwaAccount} = useAccount({isOnErrorAlert: false});
  const {bankDetails, screenLabel} = props;
  const {
    loading,
    setLoading,
    data,
    fees,
    changeDataValue,
    changeErrorMessages,
    postComputeConvenienceFee,
    computeConvenienceFeeLoading,
    setIsPromptModalError,
    patchRemoveAccountLoading,
  } = useContext(BtVerifyContext);
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
    let checkLimit = false;
    let feeData = {};

    if (isAmountValid) {
      setLoading(true);
      checkLimit = await AmountLimitHelper.postCheckOutgoingLimit({
        amount,
        action: 'FUND_TRANSFER',
        setErrorMessage: error => {
          changeErrorMessages('amount', error);
        },
      });
    }

    if (
      isAccountNameValid &&
      isAccountNumValid &&
      isAmountValid &&
      isValidEmail &&
      checkLimit &&
      !computeConvenienceFeeLoading
    ) {
      if (fees.totalServiceFee === 0 && amount > 0) {
        setIsPromptModalError(true);
        await postComputeConvenienceFee({
          variables: {
            input: {
              amount: +amount,
              cashOutBankId: bankDetails.id,
            },
          },
        }).then(res => {
          setIsPromptModalError(false);
          feeData = res?.data ? res.data.postComputeConvenienceFee : res;
        });
      }
      setLoading(false);
      if (feeData) {
        const transactionDetails = {
          accountName,
          accountNumber,
          emailAddress,
          bankDetails,
          purpose: purpose.trim(),
          providerServiceFee: fees.providerServiceFee ? fees.providerServiceFee : feeData.providerServiceFee,
          systemServiceFee: fees.systemServiceFee ? fees.systemServiceFee : feeData.systemServiceFee,
          totalServiceFee: fees.totalServiceFee
            ? fees.totalServiceFee
            : parseFloat(feeData.providerServiceFee) + parseFloat(feeData.systemServiceFee),
          type: fees.type,
          amount: parseFloat(amount),
        };
        changeDataValue('purpose', purpose.trim());
        navigation.navigate('ToktokWalletBankTransferPaymentSummary', {
          transactionDetails,
          screenLabel,
        });
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertOverlay visible={loading || patchRemoveAccountLoading} />
      <OrangeButton label="Proceed" onPress={onPressProceed} hasShadow />
    </>
  );
};

export default BtProceedButton;
