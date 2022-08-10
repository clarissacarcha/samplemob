import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//UTIL
import {moderateScale} from 'toktokload/helper';
import {ErrorUtility} from 'toktokload/util';

//COMPONENTS
import {CustomButton} from 'src/ToktokLoad/components';
import {AlertOverlay} from 'src/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

//GRAPHQL & HOOKS
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_TOKTOKWALLET_REQUEST_MONEY, POST_LOAD_TRANSACTION} from 'toktokload/graphql/model';
import {usePrompt, useAlert, useThrottle} from 'src/hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';

export const PayNowButton = ({loadDetails, mobileNumber, setInsufficient}) => {
  const {user} = useSelector(state => state.session);
  const prompt = usePrompt();
  const navigation = useNavigation();
  const {tokwaAccount, getMyAccount} = useAccount();
  const {amount, commissionRateDetails} = loadDetails;
  const totalAmount = parseFloat(amount) + parseFloat(commissionRateDetails.systemServiceFee);
  const tokwaBalance = user.toktokWalletAccountId ? parseFloat(tokwaAccount?.wallet?.balance) : 0;

  const [postToktokWalletRequestMoney, {loading: requestMoneyLoading}] = useMutation(POST_TOKTOKWALLET_REQUEST_MONEY, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: '',
      });
    },
    onCompleted: ({postToktokWalletRequestMoney}) => {
      let data = {
        loadDetails,
        tokwaBalance,
        mobileNumber,
        requestMoneyDetails: postToktokWalletRequestMoney.data,
        hash: postToktokWalletRequestMoney.hash,
      };
      return navigation.navigate('ToktokWalletTPINValidator', {
        callBackFunc: handleProcessProceed,
        onPressCancelYes: () => navigation.navigate('ToktokLoadHome'),
        enableIdle: false,
        data,
      });
    },
  });

  const [postLoadTransaction, {loading: postLoadTransactionLoading}] = useMutation(POST_LOAD_TRANSACTION, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        setErrorMessage,
        prompt,
      });
    },
    onCompleted: ({postLoadTransaction}) => {
      navigation.navigate('ToktokLoadReceipt', {receipt: postLoadTransaction.data});
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
      referenceNumber: requestMoneyDetails.referenceNumber,
      senderName: `${firstName} ${lastName}`,
      senderFirstName: firstName,
      senderMobileNumber: user.username,
      destinationNumber: mobileNumber,
      loadItemId: loadDetails.id,
      senderWalletBalance: parseFloat(tokwaBalance),
      amount: parseFloat(loadDetails.amount),
      convenienceFee: parseFloat(loadDetails.commissionRateDetails.systemServiceFee),
      senderWalletEndingBalance: parseFloat(tokwaBalance) - totalAmount,
      comRateId: loadDetails.comRateId,
      referralCode: user.consumer.referralCode,
      email: user.person.emailAddress,
    };
    postLoadTransaction({
      variables: {
        input,
      },
    });
  };

  const onPressPayNow = () => {
    postToktokWalletRequestMoney({
      variables: {
        input: {
          amount: parseFloat(totalAmount),
          note: 'Load Payment',
          transactionType: 'load',
          details: {
            Load: loadDetails.name,
            Network: loadDetails.networkDetails.name,
          },
        },
      },
    });
  };

  const onPressThrottled = useThrottle(() => {
    const isInsufficient = parseFloat(totalAmount) > tokwaBalance;
    setInsufficient(isInsufficient);
    if (!isInsufficient) onPressPayNow();
  }, 1000);

  const onPressTermsAndContidions = () => {
    let {termsAndConditions} = loadDetails;
    navigation.navigate('ToktokLoadTermsAndConditions', {termsAndConditions});
  };

  return (
    <>
      <AlertOverlay visible={requestMoneyLoading || postLoadTransactionLoading} />
      <View style={styles.container}>
        <Text>
          <Text style={styles.terms}>Please review the accuracy of the details provided and read our</Text>
          <Text style={styles.paymentPolicy} onPress={onPressTermsAndContidions}>
            {' '}
            Terms and Conditions{' '}
          </Text>
          <Text style={styles.terms}>before you proceed with your transaction.</Text>
        </Text>
      </View>
      <CustomButton onPress={onPressThrottled} label="Pay Now" hasShadow />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
  },
  terms: {
    fontSize: FONT_SIZE.S,
    color: '#525252',
  },
  paymentPolicy: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
  },
  review: {
    marginVertical: moderateScale(15),
  },
});
