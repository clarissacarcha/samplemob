import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TransactionUtility} from 'toktokwallet/util';

//GRAPHQL & HOOKS
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_REQUEST_MERCHANT_PAYMENT, POST_MERCHANT_PAYMENT} from 'toktokwallet/graphql';
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

  const {formData, qrCode, terminal, merchant, branch} = route.params;
  const {amount, serviceFee, note} = formData;

  const [postRequestMerchantPayment, {loading: requestLoading}] = useMutation(POST_REQUEST_MERCHANT_PAYMENT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      return navigation.navigate('ToktokWalletTPINValidator', {
        callBackFunc: handleProcessProceed,
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

  const [postMerchantPayment, {loading: postLoading}] = useMutation(POST_MERCHANT_PAYMENT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      return navigation.navigate('ToktokWalletMerchantPaymentReceipt', {
        receipt: {...data.postMerchantPayment, ...formData},
        terminal,
        merchant,
        branch,
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
    postRequestMerchantPayment();
  };

  const handleProcessProceed = ({pinCode = null, Otp = null, data = null}) => {
    postMerchantPayment({
      variables: {
        input: {
          TPIN: pinCode,
          amount: +amount,
          serviceFee: +serviceFee,
          qrCode,
          note,
        },
      },
    });
  };

  return (
    <>
      <AlertOverlay visible={requestLoading || postLoading} />
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
