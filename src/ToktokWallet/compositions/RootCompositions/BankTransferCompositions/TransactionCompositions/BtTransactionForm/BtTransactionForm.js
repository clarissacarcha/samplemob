/**
 * @format
 * @flow
 */

import React, {useContext, useEffect} from 'react';

import type {PropsType} from './types';
import {Container, FeeInformation, InputContainer} from './Styled';
import {CustomTextInput, CustomAmountInput} from 'toktokwallet/components';
import {BtVerifyContext} from '../BtVerifyContextProvider';
import {alphanumericRegex, numericRegex} from 'toktokwallet/helper';

const BtTransactionForm = (props: PropsType): React$Node => {
  const {data, fees, errorMessages, changeDataValue, changeErrorMessages, changeFeesValue, postComputeConvenienceFee} =
    useContext(BtVerifyContext);
  const {bankDetails} = props;

  const computeConvenienceFee = () => {
    if (data.amount !== '' && +data.amount > 0) {
      postComputeConvenienceFee({
        variables: {
          input: {
            amount: +data.amount,
            cashOutBankId: bankDetails.id,
          },
        },
      });
    } else {
      changeFeesValue('feeInformation', '');
    }
  };

  useEffect(() => {
    if (data.amount !== '' && bankDetails.id > 0 && +data.amount > 0) {
      postComputeConvenienceFee({
        variables: {
          input: {
            amount: +data.amount,
            cashOutBankId: bankDetails.id,
          },
        },
      });
    }
  }, [bankDetails, data.amount, postComputeConvenienceFee]);

  return (
    <Container>
      <InputContainer>
        <CustomTextInput
          label="Account Name"
          onChangeText={value => {
            changeDataValue('accountName', alphanumericRegex(value));
            changeErrorMessages('accountName', '');
          }}
          value={data.accountName}
          returnKeyType="done"
          errorMessage={errorMessages.accountName}
          maxLength={30}
        />
      </InputContainer>
      <InputContainer>
        <CustomTextInput
          label="Account Number"
          onChangeText={value => {
            changeDataValue('accountNumber', numericRegex(value));
            changeErrorMessages('accountNumber', '');
          }}
          value={data.accountNumber}
          returnKeyType="done"
          keyboardType="numeric"
          errorMessage={errorMessages.accountNumber}
          maxLength={19}
        />
      </InputContainer>
      <InputContainer>
        <CustomAmountInput
          label={'Enter Amount'}
          value={data.amount}
          onChangeText={value => {
            changeDataValue('amount', value);
            changeErrorMessages('amount', '');
          }}
          errorMessage={errorMessages.amount}
          onBlur={computeConvenienceFee}
        />
        {fees.feeInformation !== '' && <FeeInformation>{fees.feeInformation}</FeeInformation>}
      </InputContainer>
      <InputContainer>
        <CustomTextInput
          label="Email Address"
          onChangeText={value => {
            changeDataValue('emailAddress', value);
            changeErrorMessages('emailAddress', '');
          }}
          value={data.emailAddress}
          returnKeyType="done"
          errorMessage={errorMessages.emailAddress}
        />
      </InputContainer>
      <CustomTextInput
        label="Purpose (optional)"
        value={data.purpose}
        maxLength={120}
        placeholder="Enter purpose here"
        onChangeText={value => changeDataValue('purpose', value)}
        textAlignVertical="top"
        numberOfLines={4}
        multiline={true}
      />
    </Container>
  );
};

export default BtTransactionForm;
