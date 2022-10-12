/**
 * @format
 * @flow
 */

import React, {createContext, useState} from 'react';

import type {PropsType} from './types';
import {} from './Styled';
import {useAccount} from 'toktokwallet/hooks';
import {numberFormat, currencyCode} from 'toktokwallet/helper';

//GRAPHQL & HOOKS
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_COMPUTE_CONVENIENCE_FEE} from 'toktokwallet/graphql';
import {TransactionUtility} from 'toktokwallet/util';
import {usePrompt} from 'src/hooks';
import {useNavigation} from '@react-navigation/native';

export const BtVerifyContext: React$Context<any> = createContext<any>();
const {Provider} = BtVerifyContext;

export const BtVerifyContextProvider = (props: PropsType): React$Node => {
  const {tokwaAccount} = useAccount();
  const {children, favoriteDetails} = props;
  const prompt = usePrompt();
  const navigation = useNavigation();

  const [data, setData] = useState({
    accountName: favoriteDetails ? favoriteDetails.accountName : '',
    accountNumber: favoriteDetails ? favoriteDetails.accountNumber : '',
    amount: '',
    emailAddress: tokwaAccount.person.emailAddress,
    purpose: '',
  });
  const [fees, setFees] = useState({
    systemServiceFee: 0,
    providerServiceFee: 0,
    totalServiceFee: 0,
    type: '',
    feeInformation: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    accountName: '',
    accountNumber: '',
    amount: '',
    emailAddress: '',
    purpose: '',
  });

  const changeDataValue = (key, value) => {
    setData(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeAmount = value => {
    changeErrorMessages('amount', '');
    const num = value.replace(/[^0-9.]/g, '');
    const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
    if (!checkFormat) {
      return;
    }
    let decimalValueArray = num.split('.');
    if (decimalValueArray[0].length > 7) {
      return;
    }
    changeDataValue('amount', num[0] === '.' ? '0.' : num);
  };

  const changeErrorMessages = (key, value) => {
    setErrorMessages(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeFeesValue = (key, value) => {
    setFees(oldstate => ({...oldstate, [key]: value}));
  };

  const [postComputeConvenienceFee, {loading: computeConvenienceFeeLoading}] = useMutation(
    POST_COMPUTE_CONVENIENCE_FEE,
    {
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: error => {
        TransactionUtility.StandardErrorHandling({
          error,
          navigation,
          prompt,
          isPop: false,
        });
      },
      onCompleted: fee => {
        const {providerServiceFee, systemServiceFee, type} = fee.postComputeConvenienceFee;
        const totalServiceFee = providerServiceFee + systemServiceFee;
        const feeInformation =
          totalServiceFee > 0
            ? `Additional ${currencyCode}${numberFormat(
                totalServiceFee,
              )} convenience fee will be charged for this transaction.`
            : 'Convenience fee is waived for this transaction.';

        setFees({
          systemServiceFee,
          providerServiceFee,
          totalServiceFee,
          feeInformation,
          type: type === 'pesonet' ? 'Pesonet' : 'Instapay',
        });
      },
    },
  );

  return (
    <Provider
      value={{
        data,
        setData,
        errorMessages,
        changeErrorMessages,
        changeDataValue,
        fees,
        changeFeesValue,
        postComputeConvenienceFee,
        computeConvenienceFeeLoading,
        changeAmount,
      }}>
      {children}
    </Provider>
  );
};
