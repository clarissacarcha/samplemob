import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TransactionUtility} from 'toktokwallet/util';

//GRAPHQL & HOOKS
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_REQUEST_SEND_MONEY, POST_SEND_MONEY} from 'toktokwallet/graphql';
import {usePrompt} from 'src/hooks';

//UTIL
import {moderateScale} from 'toktokwallet/helper';

//COMPONENTS
import {OrangeButton} from 'toktokwallet/components';
import {AlertOverlay} from 'src/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT_SIZE} from 'src/res/variables';

export const ConfirmButton = ({route}) => {
  const prompt = usePrompt();
  const navigation = useNavigation();
  const formData = route.params.formData;
  const {recipientMobileNo, amount, emailAddress, note} = formData;

  const [postRequestSendMoney, {loading: requestLoading}] = useMutation(POST_REQUEST_SEND_MONEY, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      const {validator, requestSendMoneyId} = data.postRequestSendMoney;
      const screen = validator === 'TPIN' ? 'ToktokWalletTPINValidator' : 'ToktokWalletOTPValidator';
      return navigation.navigate(screen, {
        callBackFunc: handleProcessProceed,
        resendRequest: onPressConfirm,
        data: {
          requestSendMoneyId: requestSendMoneyId,
        },
      });
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
  });

  const [postSendMoney, {loading: sendMoneyLoading}] = useMutation(POST_SEND_MONEY, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      return navigation.navigate('ToktokWalletSendMoneyReceipt', {
        receipt: {...data.postSendMoney, ...formData},
      });
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
  });

  const onPressConfirm = () => {
    postRequestSendMoney({
      variables: {
        input: {
          amount: +amount,
          destinationMobileNo: recipientMobileNo,
          note,
          emailAddress,
        },
      },
    });
  };

  const handleProcessProceed = ({pinCode = null, Otp = null, data = null}) => {
    const {requestSendMoneyId} = data;
    postSendMoney({
      variables: {
        input: {
          requestSendMoneyId: requestSendMoneyId,
          OTP: Otp,
          TPIN: pinCode,
        },
      },
    });
  };

  return (
    <>
      <AlertOverlay visible={requestLoading || sendMoneyLoading} />
      <TouchableOpacity onPress={() => navigation.navigate('ToktokWalletTermsConditions')} style={styles.container}>
        <Text style={styles.terms}>
          <Text style={styles.footerText}>Please review the accuracy of the details provided and read our </Text>
          <Text style={[styles.footerText, styles.tnc]}>Terms and Conditions </Text>
          <Text style={styles.footerText}>before you proceed with your transaction.</Text>
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <OrangeButton label="Confirm" onPress={onPressConfirm} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLOR.WHITE,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
  container: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
  },
  terms: {
    textAlign: 'left',
    marginBottom: moderateScale(15),
    fontSize: FONT_SIZE.S,
  },
  tnc: {
    color: '#F6841F',
  },
  footerText: {
    fontSize: FONT_SIZE.S,
    color: '#525252',
  },
});
