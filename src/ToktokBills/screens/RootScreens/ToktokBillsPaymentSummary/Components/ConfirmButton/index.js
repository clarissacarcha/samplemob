import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//UTIL
import {moderateScale, numberFormat} from 'toktokbills/helper';
import {ErrorUtility} from 'toktokbills/util';

//GRAPHQL & HOOKS
import {useAccount} from 'toktokbills/hooks';
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_TOKTOKWALLET_REQUEST_MONEY} from 'toktokbills/graphql/model';
import {usePrompt} from 'src/hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert, useThrottle} from 'src/hooks';
import {useSelector} from 'react-redux';

//COMPONENTS
import {OrangeButton, SplashLoading} from 'toktokbills/components';
import {AlertOverlay} from 'src/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

export const ConfirmButton = ({paymentData}) => {
  const {user} = useSelector(state => state.session);
  const {tokwaAccount} = useAccount();
  const alert = useAlert();
  const prompt = usePrompt();
  const navigation = useNavigation();
  const {firstField, secondField, amount, email, billType, convenienceFee, billItemSettings, referenceNumber} =
    paymentData;
  const {termsAndConditions, paymentPolicy1, paymentPolicy2} = billItemSettings.itemDocumentDetails;
  const totalAmount = parseFloat(amount) + parseFloat(convenienceFee);
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
      let paymentSummary = {
        paymentData,
        totalAmount,
        tokwaBalance,
        requestMoneyDetails: postToktokWalletRequestMoney.data,
      };
      navigation.navigate('ToktokBillsEnterPinCode', {paymentSummary});
    },
  });

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

  const onPressTermsAndContidions = () => {
    navigation.navigate('ToktokBillsTermsAndConditions', {termsAndConditions});
  };

  return (
    <>
      <AlertOverlay visible={loading} />
      <View style={styles.container}>
        <Text style={styles.terms}>
          <Text>Please review the accuracy of the details provided and read our </Text>
          <Text style={styles.tnc} onPress={onPressTermsAndContidions}>
            Terms and Conditions{' '}
          </Text>
          <Text>before you proceed with your transaction.</Text>
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <OrangeButton onPress={onPressThrottled} disabled={checkIsDisabled()} label="Confirm" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
    marginBottom: moderateScale(60),
  },
  terms: {
    textAlign: 'left',
    marginBottom: moderateScale(15),
  },
  tnc: {
    color: '#F6841F',
  },
  paymentPolicy1: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
  },
  paymentPolicy2: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
    marginBottom: moderateScale(30),
    marginTop: moderateScale(10),
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    width: '100%',
    flex: 1,
    position: 'absolute',
    zIndex: 999,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    backgroundColor: COLOR.WHITE,
  },
});
