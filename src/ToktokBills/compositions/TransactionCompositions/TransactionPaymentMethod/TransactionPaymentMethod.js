/**
 * @format
 * @flow
 */

import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import type {PropsType} from './types';
import {
  CashInContainer,
  CashInText,
  CreateAccountText,
  CashInButton,
  Container,
  ContentContainer,
  Description,
  TokWaContainer,
  Title,
  TokWaWrapper,
  TokWaTextContaienr,
  WalletIcon,
  Toktok,
  Wallet,
  TokwaBalance,
  InsufficientContainer,
  InsufficientText,
  WarningIcon,
} from './Styled';

//GRAPHQL & HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
//COMPONENTS
import {TransactionVerifyContext} from '../TransactionVerifyContextProvider/TransactionVerifyContextProvider';
//HELPER
import {numberFormat} from 'toktokbills/helper';

const TransactionPaymentMethod = (props: PropsType): React$Node => {
  const {data, isInsufficientBalance} = useContext(TransactionVerifyContext);
  const {user} = useSelector(state => state.session);
  const navigation = useNavigation();
  const {tokwaAccount, getMyAccount} = useAccount({isOnErrorAlert: false});
  const tokwaBalance = user.toktokWalletAccountId ? tokwaAccount?.wallet?.balance : '0.00';

  const onPressTopUp = () => {
    navigation.navigate('ToktokWalletPaymentOptions', {
      amount: 0,
      onCashIn: () => getMyAccount(),
    });
  };

  const displayCashIn = () => {
    return (
      <CashInContainer>
        <CashInButton onPress={onPressTopUp}>
          <CashInText>Cash In</CashInText>
        </CashInButton>
      </CashInContainer>
    );
  };

  const displayNoToktokWalletAccount = () => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ToktokWalletLoginPage')}>
        <CreateAccountText>{`Create your toktokwallet\naccount now!`}</CreateAccountText>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <Title>Payment Method</Title>
      <ContentContainer>
        <TokWaContainer>
          <WalletIcon />
          <TokWaWrapper>
            <TokWaTextContaienr>
              <Toktok>toktok</Toktok>
              <Wallet>wallet</Wallet>
            </TokWaTextContaienr>
            {user.toktokWalletAccountId && <TokwaBalance>Balance: ₱{numberFormat(tokwaBalance)}</TokwaBalance>}
          </TokWaWrapper>
        </TokWaContainer>
        {user.toktokWalletAccountId ? displayCashIn() : displayNoToktokWalletAccount()}
      </ContentContainer>
      {user.toktokWalletAccountId && isInsufficientBalance && (
        <InsufficientContainer>
          <WarningIcon />
          <InsufficientText>Insufficient balance</InsufficientText>
        </InsufficientContainer>
      )}
    </Container>
  );
};

export default TransactionPaymentMethod;
