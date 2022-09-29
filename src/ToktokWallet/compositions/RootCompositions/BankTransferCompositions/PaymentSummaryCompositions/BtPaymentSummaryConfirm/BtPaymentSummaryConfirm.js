/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {} from './Styled';
//COMPONENTS
import {OrangeButton} from 'toktokwallet/components';
import {AlertOverlay} from 'src/components';
//GRAPHQL
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_CASH_OUT_OTHER_BANKS, POST_REQUEST_CASH_OUT} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import {usePrompt} from 'src/hooks';
import {TransactionUtility} from 'toktokwallet/util';
import {useAccount} from 'toktokwallet/hooks';

const BtPaymentSummaryConfirm = (props: PropsType): React$Node => {
  const {navigation, route} = props;
  const prompt = usePrompt();
  const {tokwaAccount} = useAccount();
  const {bankDetails, accountName, accountNumber, emailAddress, amount, purpose} = route.params.transactionDetails;
  const screenLabel = route.params?.screenLabel ? route.params.screenLabel : 'Bank Transfer';

  const [postRequestCashOut, {loading: requestLoading}] = useMutation(POST_REQUEST_CASH_OUT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      const {validator, requestFundTransferId} = data.postRequestCashOut;
      const screen = validator === 'TPIN' ? 'ToktokWalletTPINValidator' : 'ToktokWalletOTPValidator';
      return navigation.navigate(screen, {
        callBackFunc: ProceedTransaction,
        data: {
          requestFundTransferId: requestFundTransferId,
        },
      });
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        onPress: () => navigation.pop(2),
      });
    },
  });

  const [postCashOutOtherBank, {loading: cashOutOtherBankLoading}] = useMutation(POST_CASH_OUT_OTHER_BANKS, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      const receipt = {
        headerDetails: bankDetails,
        accountName,
        accountNumber,
        emailAddress,
        amount,
        purpose,
        ...data.postCashOutOtherBank,
      };
      navigation.navigate('ToktokWalletBankTransferReceipt', {receipt, screenLabel});
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        isNewFt: true,
      });
    },
  });

  const ProceedTransaction = ({pinCode = null, Otp = null, data = {}}) => {
    const {requestFundTransferId} = data;
    postCashOutOtherBank({
      variables: {
        input: {
          requestFundTransferId: requestFundTransferId,
          OTP: Otp,
          TPIN: pinCode,
        },
      },
    });
  };

  const onPressConfirm = () => {
    postRequestCashOut({
      variables: {
        input: {
          amount: +amount,
          cashOutBankId: bankDetails.id,
          accountName: accountName,
          accountNumber: accountNumber,
          note: purpose,
          currencyId: tokwaAccount.wallet.currency.id,
          address: '',
          emailAddress: emailAddress,
          type: 'Other Banks',
        },
      },
    });
  };
  return (
    <>
      <AlertOverlay visible={requestLoading || cashOutOtherBankLoading} />
      <OrangeButton label={'Confirm'} hasShadow onPress={onPressConfirm} />
    </>
  );
};

export default BtPaymentSummaryConfirm;
