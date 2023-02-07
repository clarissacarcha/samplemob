import React, {useState, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, Linking} from 'react-native';
import {RNCamera} from 'react-native-camera';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
//GRAPHQL
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_VALIDATE_QR_CODE} from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';
import {usePrompt} from 'src/hooks';
import {TransactionUtility} from 'toktokwallet/util';
import {useFocusEffect} from '@react-navigation/native';
//COMPONENTS
import {CheckIdleState, OrangeButton} from 'toktokwallet/components';
import {AlertOverlay} from 'src/components';
//HELPER, CONSTANTS
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const {height, width} = Dimensions.get('screen');

export const ScanQr = ({navigation, route}) => {
  const prompt = usePrompt();
  const [errMessage, setErrMessage] = useState('');
  const [torch, setTorch] = useState(false);
  const [focusCamera, setFocusCamera] = useState(false);
  const [qr, setQr] = useState(null);
  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [boundaryArea, setBoundaryArea] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  useFocusEffect(
    useCallback(() => {
      setFocusCamera(true);
      return () => setFocusCamera(false);
    }, []),
  );

  // useEffect(() => {
  //   setFocusCamera(true);
  //   return () => setFocusCamera(false);
  // }, []);

  const [postValidateQRCode, {loading}] = useMutation(POST_VALIDATE_QR_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
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
      // setTorch(false);
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

  const barcodeRead = e => {
    const barcode = Platform.OS === 'android' ? e.barcodes[0] : e;
    const resultBounds = {
      height: barcode.bounds.size.height,
      width: barcode.bounds.size.width,
      x: barcode.bounds.origin.x,
      y: barcode.bounds.origin.y,
    };

    const checkifOutside = checkifOutsideBox(boundaryArea, resultBounds);

    if (!checkifOutside) {
      setQr(barcode.data);
      setErrMessage('');
      postValidateQRCode({
        variables: {
          input: {
            qrCode: barcode.data,
          },
        },
      });
      setTorch(false);
    }
  };

  const checkifOutsideBox = (boundary, result) => {
    return (
      result.x < boundary.x ||
      result.x + result.width > boundary.x + boundary.width ||
      result.y < boundary.y ||
      result.y + result.height > boundary.y + boundary.height ||
      result.height > boundary.height ||
      result.width > boundary.width
    );
  };

  return (
    <CheckIdleState>
      <AlertOverlay visible={loading} />
      <View style={{flex: 1}}>
        <RNCamera
          style={styles.rnCamera}
          type={RNCamera.Constants.Type.back}
          flashMode={torch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          onBarCodeRead={Platform.OS === 'ios' && !loading && focusCamera ? barcodeRead : null}
          onGoogleVisionBarcodesDetected={Platform.OS === 'android' && !loading && focusCamera ? barcodeRead : null}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status, recordAudioPermissionStatus}) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={status !== 'READY' ? styles.notBackReady : styles.backBtn}>
                  <FIcon5 name="chevron-left" size={moderateScale(16)} color={'#F6841F'} />
                </TouchableOpacity>
                {status !== 'READY' ? (
                  <View style={styles.permissionContainer}>
                    <Text>Camera Not Authorized</Text>
                  </View>
                ) : (
                  <>
                    <Text
                      style={{
                        fontFamily: FONT.REGULAR,
                        fontSize: FONT_SIZE.XL,
                        color: COLOR.WHITE,
                        marginBottom: moderateScale(30),
                      }}>
                      Scan QR Code
                    </Text>
                    <View
                      style={styles.centerBox}
                      onLayout={e => {
                        setBoundaryArea(e.nativeEvent.layout);
                      }}>
                      <View style={[styles.borderEdges, styles.topLeft]} />
                      <View style={[styles.borderEdges, styles.topRight]} />
                      <View style={[styles.borderEdges, styles.bottomLeft]} />
                      <View style={[styles.borderEdges, styles.bottomRight]} />
                    </View>
                    <View style={{marginTop: moderateScale(40)}}>
                      <View style={styles.bottomContainer}>
                        <Text style={styles.bottomText}>Position the QR code within the frame.</Text>
                      </View>
                      {errMessage !== '' && <Text style={styles.errorMessage}>{errMessage}</Text>}
                    </View>
                  </>
                )}
              </>
            );
          }}
        </RNCamera>
      </View>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: moderateScale(18),
    padding: moderateScale(32),
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: moderateScale(21),
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: moderateScale(16),
  },
  customMarker: {
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBox: {
    height: width * 0.7,
    width: width * 0.7,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  borderEdges: {
    height: moderateScale(40),
    width: moderateScale(40),
    position: 'absolute',
    borderColor: '#F6841F',
  },
  backBtn: {
    backgroundColor: '#FFFFFF',
    top: Platform.OS === 'android' ? moderateScale(45) : moderateScale(16),
    left: moderateScale(16),
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(100),
    height: moderateScale(30),
    width: moderateScale(30),
  },
  notBackReady: {
    top: Platform.OS === 'android' ? moderateScale(45) : moderateScale(16),
    left: moderateScale(16),
    position: 'absolute',
    zIndex: 1,
    height: moderateScale(30),
    width: moderateScale(30),
  },
  rnCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  bottomText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: COLOR.WHITE,
  },
  bottomContainer: {
    backgroundColor: '#9E9E9EC4',
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
  },
  errMessage: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.L,
    color: COLOR.RED,
    marginBottom: 20,
    textAlign: 'center',
  },
  topLeft: {
    borderTopWidth: 5,
    borderLeftWidth: 5,
    top: 0,
    left: 0,
  },
  topRight: {
    borderTopWidth: 5,
    borderRightWidth: 5,
    top: 0,
    right: 0,
  },
  bottomLeft: {
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    borderBottomWidth: 5,
    borderRightWidth: 5,
    bottom: 0,
    right: 0,
  },
  permissionContainer: {
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
});
