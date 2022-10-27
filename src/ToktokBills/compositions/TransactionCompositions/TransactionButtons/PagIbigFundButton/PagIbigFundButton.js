/**
 * @format
 * @flow
 */

import React, {useContext} from 'react';

import type {PropsType} from './types';
import {} from './Styled';
import validator from 'validator';
//HELPER & UTIL
import {currencyCode} from 'toktokbills/helper';
//COMPONENTS
import {OrangeButton} from 'toktokwallet/components';
import {TransactionVerifyContext} from '../../TransactionVerifyContextProvider';
//GRAPHQL & HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const PagIbigFundButton = (props: PropsType): React$Node => {
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
    checkContactNumber,
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
    if (+amount === 0 && amount !== '') {
      error = 'Enter the payment amount to proceed with the transaction';
    } else {
      if (amount !== '' && +amount < data.paymentType?.minAmount) {
        error = `The minimum amount to pay for this transaction is ${currencyCode}${data.paymentType?.minAmount}. Enter the correct amount.`;
      }
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

    const isFirstFieldValid = checkIsValidField('firstField', data.firstField, 'Account Number', 20, 2, 12);
    const isPaymentTypeValid = isFieldRequired('paymentType', data.paymentType.name, 'selection');
    const isSecondFieldValid = checkContactNumber('secondField', data.secondField);
    const isPcfValid = isFieldRequired('periodCoveredFrom', data.periodCoveredFrom);
    const isPctValid = isFieldRequired('periodCoveredTo', data.periodCoveredTo);
    const isAmountValid = checkAmount();
    const isValidEmail = checkEmail();

    if (
      isFirstFieldValid &&
      isPaymentTypeValid &&
      isSecondFieldValid &&
      isPcfValid &&
      isPctValid &&
      isAmountValid &&
      isValidEmail
    ) {
      const paymentData = {
        ...data,
        secondField: `+63${data.secondField}`,
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

export default PagIbigFundButton;
