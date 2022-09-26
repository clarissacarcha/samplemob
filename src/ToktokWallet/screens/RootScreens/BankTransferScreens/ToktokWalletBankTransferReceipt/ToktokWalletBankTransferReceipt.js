/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, Label, Value} from './Styled';
import {Receipt} from 'toktokwallet/compositions';
import {useRoute} from '@react-navigation/native';
import {numberFormat, currencyCode} from 'toktokwallet/helper';
import moment from 'moment';

const ToktokWalletBankTransferReceipt = (props: PropsType): React$Node => {
  const route = useRoute();
  const {
    accountName,
    accountNumber,
    amount,
    cashOutUbApiLog,
    createdAt,
    emailAddress,
    providerServiceFee,
    purpose,
    referenceNumber,
    systemServiceFee,
  } = route.params.receipt;
  const transactionDate = moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  const totalServiceFee = providerServiceFee + systemServiceFee;

  return (
    <Receipt>
      <Container>
        <Label>Reference Number</Label>
        <Value isRefNum>{referenceNumber}</Value>
      </Container>
      <Container>
        <Label>Trace Number</Label>
        <Value>{cashOutUbApiLog.traceNumber}</Value>
      </Container>
      <Container>
        <Label>Transaction Date</Label>
        <Value>{transactionDate}</Value>
      </Container>
      <Container>
        <Label>Account Name</Label>
        <Value>{accountName}</Value>
      </Container>
      <Container>
        <Label>Account Number</Label>
        <Value>{accountNumber}</Value>
      </Container>
      <Container>
        <Label>Email Address</Label>
        <Value>{emailAddress}</Value>
      </Container>
      {purpose !== '' && (
        <Container>
          <Label>Purpose</Label>
          <Value>{purpose}</Value>
        </Container>
      )}
      <Container>
        <Label>Amount</Label>
        <Value>
          {currencyCode}
          {numberFormat(amount)}
        </Value>
      </Container>
      <Container>
        <Label>Convenience Fee</Label>
        <Value>
          {currencyCode}
          {numberFormat(totalServiceFee)}
        </Value>
      </Container>
      <Container>
        <Label>Total</Label>
        <Value>
          {currencyCode}
          {numberFormat(totalServiceFee + amount)}
        </Value>
      </Container>
    </Receipt>
  );
};

export default ToktokWalletBankTransferReceipt;
