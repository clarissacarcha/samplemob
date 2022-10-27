import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TransactionUtility} from 'toktokwallet/util';

//GRAPHQL & HOOKS
import {useAccount} from 'toktokbills/hooks';
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_FINALIZE_OTC, POST_INITIALIZE_OTC} from 'toktokwallet/graphql';
import {usePrompt} from 'src/hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert, useThrottle} from 'src/hooks';
import {useSelector} from 'react-redux';

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
  const {
    recipientName,
    recipientMobileNo,
    email,
    amount,
    purpose,
    otcPartnerDetails,
    toktokServiceFee,
    providerServiceFee,
    cashOutProviderPartnerId,
  } = route.params.transactionDetails;

  const [postFinalizeOtc, {loading: postFinalizeOtcLoading}] = useMutation(POST_FINALIZE_OTC, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        onPress: () => navigation.navigate('ToktokWalletCashOutOTCHome'),
      });
    },
    onCompleted: ({postFinalizeOtc}) => {
      console.log(postFinalizeOtc);
      navigation.navigate('ToktokWalletCashOutOTCReceipt', {
        receipt: postFinalizeOtc,
        transactionDetails: {otcPartnerDetails, recipientName, recipientMobileNo},
      });
    },
  });

  const [postInitializeOtc, {loading: postInitializeOtcLoading}] = useMutation(POST_INITIALIZE_OTC, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
    onCompleted: ({postInitializeOtc}) => {
      navigation.navigate('ToktokWalletTPINValidator', {
        callBackFunc: handleProcessProceed,
        enableIdle: false,
      });
    },
  });

  const onPressConfirm = () => {
    const input = {
      amount,
      cashOutProviderPartnerId,
      convenienceFee: providerServiceFee,
      serviceFee: toktokServiceFee,
    };
    postInitializeOtc({
      variables: {
        input,
      },
    });
  };

  const handleProcessProceed = ({pinCode}) => {
    const input = {
      amount,
      cashOutProviderPartnerId,
      note: purpose,
      emailAddress: email,
      convenienceFee: providerServiceFee,
      serviceFee: toktokServiceFee,
      validator: 'TPIN',
      pinCode,
    };

    postFinalizeOtc({
      variables: {
        input,
      },
    });
  };

  return (
    <>
      <AlertOverlay visible={postFinalizeOtcLoading || postInitializeOtcLoading} />
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
});
