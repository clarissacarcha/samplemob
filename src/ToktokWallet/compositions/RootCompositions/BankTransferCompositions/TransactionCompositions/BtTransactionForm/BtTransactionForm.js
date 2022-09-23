/**
 * @format
 * @flow
 */

import React, {useContext, useEffect} from 'react';

import type {PropsType} from './types';
import {Container, FeeInformation, InputContainer} from './Styled';
import {CustomTextInput, CustomAmountInput} from 'toktokwallet/components';
import {BtVerifyContext} from '../BtVerifyContextProvider';
import {alphanumericRegex, numericRegex, numberFormat, currencyCode} from 'toktokwallet/helper';
//GRAPHQL & HOOKS
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_COMPUTE_CONVENIENCE_FEE} from 'toktokwallet/graphql';

const BtTransactionForm = (props: PropsType): React$Node => {
  const {data, fees, errorMessages, changeDataValue, changeErrorMessages, changeFeesValue} =
    useContext(BtVerifyContext);
  const {bankDetails} = props;

  const [postComputeConvenienceFee, {loading: computeLoading}] = useMutation(POST_COMPUTE_CONVENIENCE_FEE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    // onError: (error)=> onErrorAlert({alert,error}),
    onCompleted: fee => {
      const {providerServiceFee, systemServiceFee, type} = fee.postComputeConvenienceFee;
      const totalSF = providerServiceFee + systemServiceFee;
      const feeInformation =
        totalSF > 0
          ? `Additional ${currencyCode}${numberFormat(totalSF)} convenience fee will be charged for this transaction.`
          : 'Convenience fee is waived for this transaction.';
      changeFeesValue('systemServiceFee', systemServiceFee);
      changeFeesValue('providerServiceFee', providerServiceFee);
      changeFeesValue('totalServiceFee', totalSF);
      changeFeesValue('type', type === 'pesonet' ? 'Pesonet' : 'Instapay');
      changeFeesValue('feeInformation', feeInformation);
    },
  });

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
        {fees.feeInformation !== '' && !computeLoading && <FeeInformation>{fees.feeInformation}</FeeInformation>}
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
