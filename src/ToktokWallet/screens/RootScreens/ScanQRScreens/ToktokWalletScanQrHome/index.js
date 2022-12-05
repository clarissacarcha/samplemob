import React, {useContext, useState, useRef, useMemo} from 'react';
import {View, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import {
  CheckIdleState,
  FlagSecureScreen,
  HeaderBack,
  HeaderTitleRevamp,
  HeaderDownloadReceipt,
} from 'toktokwallet/components';
import ViewShot from 'react-native-view-shot';

import {launchImageLibrary} from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';
//GRAPHQL
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_VALIDATE_QR_CODE} from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';
import {usePrompt} from 'src/hooks';
import {TransactionUtility} from 'toktokwallet/util';
//SELF IMPORTS
import {ScanQr, GenerateQr, ScanQrOption, VerifyContextProvider, VerifyContext} from './Components';
import {AlertOverlay} from 'src/components';
//ASSETS
import {backgrounds} from 'toktokwallet/assets';

const MainComponent = ({navigation, route}) => {
  const {qrOptions, onShare} = useContext(VerifyContext);
  const prompt = usePrompt();
  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [qr, setQr] = useState(null);
  const viewshotRef = useRef();
  const [onCapturingScreen, setOnCapturingScreen] = useState(false);
  const [loadingDecodeQr, setLoadingDecodeQr] = useState(false);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'QR Code'} />,
    headerRight: () => (
      <HeaderDownloadReceipt
        viewshotRef={viewshotRef}
        onPressDownloadReceipt={val => {
          setOnCapturingScreen(val);
        }}
        promptTitle="QR Code Downloaded"
        promptMessage="Your QR Code has been saved to your gallery."
      />
    ),
    headerShown: qrOptions !== 'scan',
  });

  const [postValidateQRCode, {loading}] = useMutation(POST_VALIDATE_QR_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      console.log(error);
      setLoadingDecodeQr(false);
      // return setErrMessage("QR code must be valid")
      TransactionUtility.StandardErrorHandling({
        error,
        prompt,
        navigation,
        onPress: () => {},
        isPop: false,
        title: 'Invalid QR Code',
        message: 'The QR Code is invalid. Try another QR.',
      });
    },
    onCompleted: data => {
      setLoadingDecodeQr(false);
      const {account, action, QRInfo} = data.postValidateQRCode;
      if (action === 'sendMoney') {
        if (account) {
          if (account.mobileNumber === tokwaAccount.mobileNumber) {
            return prompt({
              title: 'QR Code Not Allowed',
              message: 'The QR detected is your QR Code. Try another QR.',
              type: 'error',
              event: 'TOKTOKBILLSLOAD',
            });
          }
          return navigation.navigate('ToktokWalletScanQRTransaction', {
            recipientInfo: account,
            QRInfo,
            headerTitle: 'Send Money via QR',
          });
        }
      } else {
        return navigation.navigate('ToktokWalletMerchantPaymentTransaction', {
          merchant: data.postValidateQRCode?.merchant,
          branch: data.postValidateQRCode?.branch,
          terminal: data.postValidateQRCode?.terminal,
          qrCode: qr,
        });
      }
    },
  });

  const handleUploadQr = () => {
    try {
      launchImageLibrary({}, async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          if (response.uri) {
            setLoadingDecodeQr(true);
            var path = response.path;
            if (!path) {
              path = response.uri;
            }
            await DecodeQR(path);
          }
        }
      });
    } catch (err) {
      throw err;
    }
  };

  const DecodeQR = async path => {
    RNQRGenerator.detect({
      uri: path,
    })
      .then(response => {
        const {values} = response; // Array of detected QR code values. Empty if nothing found.
        if (values.length === 0) {
          setLoadingDecodeQr(false);
          return prompt({
            title: 'QR Code Undetected',
            message: 'There’s no QR Code detected. Try again.',
            type: 'error',
            event: 'TOKTOKBILLSLOAD',
          });
        }
        // if(values.length == 0 ) return setErrMessage("No QR code detected!")
        values.map(async qrcode => {
          await onUploadSuccess(qrcode);
        });
      })
      .catch(error => {
        setLoadingDecodeQr(false);
        return prompt({
          title: 'QR Code Undetected',
          message: 'There’s no QR Code detected. Try again.',
          type: 'error',
          event: 'TOKTOKBILLSLOAD',
        });
      });
  };

  const onUploadSuccess = qrCode => {
    setQr(qrCode);
    postValidateQRCode({
      variables: {
        input: {
          qrCode,
        },
      },
    });
  };

  const DisplayQrCode = useMemo(() => {
    return (
      <ViewShot
        ref={viewshotRef}
        style={styles.flex}
        options={{format: 'jpg', 'width/height': 1100 / 800, result: onShare ? 'base64' : 'tmpfile'}}>
        <ImageBackground source={backgrounds.gradient_bg} style={styles.flex}>
          {onCapturingScreen || onShare ? (
            <View style={styles.flex}>
              <GenerateQr onCapturingScreen={onCapturingScreen} viewshotRef={viewshotRef} />
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <GenerateQr onCapturingScreen={onCapturingScreen} viewshotRef={viewshotRef} />
            </ScrollView>
          )}
        </ImageBackground>
      </ViewShot>
    );
  }, [onCapturingScreen, viewshotRef, onShare]);

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loadingDecodeQr} />
      {qrOptions === 'scan' ? <ScanQr navigation={navigation} route={route} /> : DisplayQrCode}
      {!onCapturingScreen && (
        <ScanQrOption
          handleUploadQr={() => {
            handleUploadQr();
          }}
        />
      )}
    </View>
  );
};

export const ToktokWalletScanQrHome = ({navigation, route}) => {
  return (
    <FlagSecureScreen>
      <CheckIdleState>
        <VerifyContextProvider>
          <MainComponent navigation={navigation} route={route} />
        </VerifyContextProvider>
      </CheckIdleState>
    </FlagSecureScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  options: {
    paddingHorizontal: 16,
  },
  flex: {
    flex: 1,
  },
});
