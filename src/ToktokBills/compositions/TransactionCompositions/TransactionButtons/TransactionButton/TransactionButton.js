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
import {AlertOverlay} from 'src/components';
//GRAPHQL & HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_BILLS_VALIDATE_TRANSACTION} from 'toktokbills/graphql/model';
import {usePrompt, useThrottle} from 'src/hooks';
import {ErrorUtility} from 'toktokbills/util';

const TransactionButton = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.session);
  const prompt = usePrompt();
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
        ...data,
        itemCode,
        amount,
        billType,
        billItemSettings,
        referenceNumber: ReferenceNumber,
        providerServiceFee: commissionRateDetails?.providerServiceFee,
        systemServiceFee: commissionRateDetails?.systemServiceFee,
        totalServiceFee: totalServiceFee,
      };
      navigation.navigate('ToktokBillsPaymentSummary', {paymentData});
    },
  });

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
      firstFieldName,
      firstFieldWidth,
      firstFieldWidthType,
      firstFieldMinWidth,
    );
    const isSecondFieldValid = checkIsValidField(
      'secondField',
      data.secondField,
      secondFieldName,
      secondFieldWidth,
      secondFieldWidthType,
      secondFieldMinWidth,
    );
    const isAmountValid = checkAmount();
    const isValidEmail = checkEmail();

    if (isFirstFieldValid && isSecondFieldValid && isAmountValid && isValidEmail) {
      console.log({
        name: billItemSettings.name,
        destinationNumber: data.firstField,
        destinationIdentifier: data.secondField,
        amount: parseFloat(data.amount),
        providerId,
      });
      postBillsValidateTransaction({
        variables: {
          input: {
            name: 'BATELEC1',
            destinationNumber: data.firstField,
            destinationIdentifier: data.secondField,
            amount: parseFloat(data.amount),
            providerId,
          },
        },
      });
    }
  };

  return (
    <>
      <AlertOverlay visible={loading} />
      <OrangeButton onPress={onPressProceed} label="Next" hasShadow />
    </>
  );
};

export default TransactionButton;
