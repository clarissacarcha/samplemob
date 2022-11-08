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
//GRAPHQL & HOOKS
import {useAccount} from 'toktokbills/hooks';
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_BILLS_TRANSACTION, POST_TOKTOKWALLET_REQUEST_MONEY, POST_BILLS_SSS} from 'toktokbills/graphql/model';
import {usePrompt} from 'src/hooks';
import {ErrorUtility} from 'toktokbills/util';
import {useAlert, useThrottle} from 'src/hooks';
import {useSelector} from 'react-redux';

const PaymentSummaryButton = (props: PropsType): React$Node => {
  const {navigation, route} = props;
  const {paymentData} = route.params;
  const {user} = useSelector(state => state.session);
  const {tokwaAccount} = useAccount();
  const prompt = usePrompt();
  const {
    firstField,
    secondField,
    amount,
    emailAddress,
    billType,
    totalServiceFee,
    billItemSettings,
    referenceNumber,
    itemCode,
    payorType,
  } = paymentData;
  const {termsAndConditions, paymentPolicy1, paymentPolicy2} = billItemSettings.itemDocumentDetails;
  const totalAmount = parseFloat(amount) + parseFloat(totalServiceFee);
  const tokwaBalance = user?.toktokWalletAccountId ? tokwaAccount?.wallet?.balance : '0.00';

  const [postToktokWalletRequestMoney, {loading, error}] = useMutation(POST_TOKTOKWALLET_REQUEST_MONEY, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
    onCompleted: ({postToktokWalletRequestMoney}) => {
      let data = {
        paymentData,
        totalAmount,
        tokwaBalance,
        requestMoneyDetails: postToktokWalletRequestMoney.data,
        hash: postToktokWalletRequestMoney.hash,
      };
      return navigation.navigate('ToktokWalletTPINValidator', {
        callBackFunc: handleProcessProceed,
        onPressCancelYes: () => navigation.navigate('ToktokBillsHome'),
        enableIdle: false,
        data,
      });
    },
  });

  const [postBillsTransaction, {loading: postBillsTransactionLoading}] = useMutation(POST_BILLS_TRANSACTION, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        onPress: () => navigation.navigate('ToktokBillsHome'),
      });
    },
    onCompleted: ({postBillsTransaction}) => {
      navigation.navigate('ToktokBillsReceipt', {receipt: postBillsTransaction.data, paymentData});
    },
  });

  const [postBillsSSS, {loading: postBillsSssLoading}] = useMutation(POST_BILLS_SSS, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        onPress: () => navigation.navigate('ToktokBillsHome'),
      });
    },
    onCompleted: ({postBillsSSS}) => {
      navigation.navigate('ToktokBillsReceipt', {receipt: postBillsSSS.data, paymentData});
    },
  });

  const handleProcessProceed = ({pinCode, data}) => {
    let {totalAmount, requestMoneyDetails, paymentData, hash} = data;
    let {firstName, lastName} = user.person;

    let input = {
      hash,
      requestMoneyDetails: {
        requestTakeMoneyId: requestMoneyDetails.requestTakeMoneyId,
        TPIN: requestMoneyDetails.validator === 'TPIN' ? pinCode : '',
        OTP: requestMoneyDetails.validator === 'OTP' ? pinCode : '',
      },
      referenceNumber: requestMoneyDetails?.referenceNumber,
      senderName: `${firstName} ${lastName}`,
      senderFirstName: firstName,
      senderMobileNumber: user.username,
      destinationNumber: firstField,
      destinationIdentifier: secondField,
      billItemId: billItemSettings.id,
      senderWalletBalance: parseFloat(data.tokwaBalance),
      amount: parseFloat(amount),
      senderWalletEndingBalance: parseFloat(data.tokwaBalance) - parseFloat(totalAmount),
      convenienceFee: parseFloat(totalServiceFee),
      discount: 0,
      comRateId: billItemSettings.commissionRateDetails.id,
      email: emailAddress.toLowerCase(),
      referralCode: user.consumer.referralCode,
    };

    if (itemCode === 'SSS') {
      postBillsSSS({
        variables: {
          input: {
            ...input,
            ...{
              prn: firstField,
              membershipType: +payorType.code,
            },
          },
        },
      });
    } else {
      postBillsTransaction({
        variables: {
          input,
        },
      });
    }
  };

  const onPressConfirm = () => {
    postToktokWalletRequestMoney({
      variables: {
        input: {
          referenceNumber,
          amount: parseFloat(totalAmount),
          note: 'Bills payment',
          transactionType: 'bills',
          details: {
            Biller: paymentData.billItemSettings.name,
            Category: paymentData.billType.name,
          },
        },
      },
    });
  };

  const checkIsDisabled = () => {
    return parseFloat(totalAmount) > parseFloat(tokwaBalance);
  };

  const onPressThrottled = useThrottle(() => {
    onPressConfirm();
  }, 1000);

  return (
    <>
      <AlertOverlay visible={loading || postBillsTransactionLoading || postBillsSssLoading} />
      <OrangeButton label={'Confirm'} hasShadow onPress={onPressThrottled} />
    </>
  );
};

export default PaymentSummaryButton;
