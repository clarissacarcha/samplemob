/**
 * @format
 * @flow
 */

import React, {createContext, useState} from 'react';

import type {PropsType} from './types';
import {} from './Styled';
import {useAccount} from 'toktokwallet/hooks';

export const BtVerifyContext: React$Context<any> = createContext<any>();
const {Provider} = BtVerifyContext;

export const BtVerifyContextProvider = (props: PropsType): React$Node => {
  const {tokwaAccount} = useAccount();
  const {children} = props;

  const [data, setData] = useState({
    accountName: '',
    accountNumber: '',
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

  const changeErrorMessages = (key, value) => {
    setErrorMessages(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeFeesValue = (key, value) => {
    setFees(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

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
      }}>
      {children}
    </Provider>
  );
};
