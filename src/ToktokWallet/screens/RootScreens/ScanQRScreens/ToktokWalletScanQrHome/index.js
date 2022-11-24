import React, {useContext, useState, useRef} from 'react';
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
import {useAlert} from 'src/hooks/useAlert';
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_VALIDATE_QR_CODE} from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';

//SELF IMPORTS
import {ScanQr, GenerateQr, ScanQrOption, VerifyContextProvider, VerifyContext} from './Components';
import {AlertOverlay} from 'src/components';
//ASSETS
import {backgrounds} from 'toktokwallet/assets';

const MainComponent = ({navigation, route}) => {
  const {qrOptions, onShare} = useContext(VerifyContext);
  const alertHook = useAlert();
  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [qr, setQr] = useState(null);
  const viewshotRef = useRef();
  const [onCapturingScreen, setOnCapturingScreen] = useState(false);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'QR Code'} />,
    // headerRight: () => <HeaderRight isDownload onPress={handleDownloadQrCode} />,
    headerRight: () => (
      <HeaderDownloadReceipt
        viewshotRef={viewshotRef}
        // refNo={route.params.receipt.referenceNumber}
        onPressDownloadReceipt={val => {
          setOnCapturingScreen(val);
        }}
      />
    ),
    headerShown: qrOptions !== 'scan',
  });

  const [postValidateQRCode, {loading}] = useMutation(POST_VALIDATE_QR_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      // return setErrMessage("QR code must be valid")
      return alertHook({message: 'Qr code must be valid'});
    },
    onCompleted: data => {
      const {account, action, QRInfo} = data.postValidateQRCode;
      if (action === 'sendMoney') {
        if (account) {
          if (account.mobileNumber === tokwaAccount.mobileNumber) {
            // return setErrMessage("You cannot send money to yourself")
            return alertHook({message: 'You cannot send money to yourself'});
          }
          return navigation.navigate('ToktokWalletScanQRConfirm', {recipientInfo: account, QRInfo});
        }
      } else {
        return navigation.navigate('ToktokWalletMerchantPaymentConfirm', {
          merchant: postValidateQRCode?.merchant,
          branch: postValidateQRCode?.branch,
          terminal: postValidateQRCode?.terminal,
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
          return alertHook({message: 'No QR code detected!'});
        }
        // if(values.length == 0 ) return setErrMessage("No QR code detected!")
        values.map(async qrcode => {
          await onUploadSuccess(qrcode);
        });
      })
      .catch(error => console.log('Cannot detect QR code in image', error));
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

  const DisplayQrCode = () => {
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
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      {qrOptions === 'scan' ? <ScanQr navigation={navigation} route={route} /> : <DisplayQrCode />}
      {!onCapturingScreen && <ScanQrOption handleUploadQr={handleUploadQr} />}
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
