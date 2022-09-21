/**
 * @format
 * @flow
 */

import React, {useState, useRef, useEffect} from 'react';

import type {PropsType} from './types';
import {
  Amount,
  ArrowDown,
  ArrowRight,
  Button,
  ButtonTitleContainer,
  Container,
  ContentContainer,
  ContentSubContainer,
  CurrencyCodeContainer,
  CurrencyCode,
  Description,
  Label,
  Separator,
  TitleContainer,
} from './Styled';
import {Animated} from 'react-native';
import {useAccount} from 'toktokwallet/hooks';
import {currencyCode, numberFormat} from 'toktokwallet/helper';

const TransferableAndNonTransferableBalance = (props: PropsType): React$Node => {
  const [showDetails, setShowDetails] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0));
  const {tokwaAccount} = useAccount();

  useEffect(() => {
    Animated.timing(fadeAnim.current, {
      toValue: showDetails ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showDetails]);

  return (
    <Container>
      <Button
        onPress={() => {
          setShowDetails(prev => !prev);
        }}>
        <ButtonTitleContainer>
          <CurrencyCodeContainer>
            <CurrencyCode>{currencyCode}</CurrencyCode>
          </CurrencyCodeContainer>
        </ButtonTitleContainer>
        <Label>Transferable and Non-transferable Balance</Label>
        {showDetails ? <ArrowDown /> : <ArrowRight />}
      </Button>
      {showDetails && (
        <ContentContainer opacity={fadeAnim.current}>
          <ContentSubContainer>
            <TitleContainer>
              <Label>Transferable Balance</Label>
              <Amount>
                {currencyCode}
                {numberFormat(tokwaAccount.wallet.transferableBalance)}
              </Amount>
            </TitleContainer>
            <Description>
              Cash Ins via online banks, debit card, OTC bank, OTC non-bank and JC Wallet can be transferred to other
              toktokwallet users’ accounts and/or bank accounts.
            </Description>
          </ContentSubContainer>
          <Separator />
          <ContentSubContainer>
            <TitleContainer>
              <Label>Non-Transferable Balance</Label>
              <Amount>
                {currencyCode}
                {numberFormat(tokwaAccount.wallet.creditCardBalance)}
              </Amount>
            </TitleContainer>
            <Description>
              Cash Ins via credit card, or foreign debit card cannot be transferred to any toktokwallet users’ accounts
              and/or bank accounts. This toktokwallet balance can only be used as payments for goods and services.
            </Description>
          </ContentSubContainer>
        </ContentContainer>
      )}
    </Container>
  );
};

export default TransferableAndNonTransferableBalance;
