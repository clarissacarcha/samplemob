import React, {useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import {useThrottle} from 'toktokwallet/hooks';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'toktokwallet/helper';
import FIcon from 'react-native-vector-icons/Feather';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_GENERATE_ACCOUNT_QR_CODE} from 'toktokwallet/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import ViewShot, {captureScreen, releaseCapture} from 'react-native-view-shot';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {useAccount} from 'toktokwallet/hooks';
import QRCode from 'react-native-qrcode-svg';
import tokwaLogo from 'toktokwallet/assets/images/tokwa.png';
import CONSTANTS from 'common/res/constants';
import {ReceiptSeparator} from 'toktokwallet/components';
import DashedLine from 'react-native-dashed-line';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE, MARGIN} = CONSTANTS;

export const MyQrCode = () => {
  const viewshotRef = useRef();
  const [qrcode, setQrcode] = useState(null);
  const {tokwaAccount} = useAccount();

  const [postGenerateAccountQrCode, {error, loading}] = useMutation(POST_GENERATE_ACCOUNT_QR_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({postGenerateAccountQrCode}) => {
      const {encryptedQRToken} = postGenerateAccountQrCode;
      setQrcode(encryptedQRToken);
    },
  });

  useEffect(() => {
    postGenerateAccountQrCode();
  }, []);

  const checkAndRequest = Platform.select({
    android: async () => {
      const checkResult = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      if (checkResult === RESULTS.GRANTED) {
        return true;
      }
      if (checkResult === RESULTS.BLOCKED) {
        Alert.alert(
          '',
          "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
        );
        return false;
      }
      if (checkResult === RESULTS.UNAVAILABLE) {
        Alert.alert('', 'Access to storage is unavailable.');
        return false;
      }

      if (checkResult === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

        if (checkResult === RESULTS.GRANTED) {
          return true;
        }
        if (checkResult === RESULTS.BLOCKED) {
          Alert.alert(
            '',
            "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
          );
          return false;
        }

        if (requestResult === RESULTS.DENIED) {
          Alert.alert('', "Sorry, we can't access your storage without sufficient permission.");
          return false;
        }
      }
    },
    ios: async () => {
      // const checkResult = await check(PERMISSIONS.IOS.MEDIA_LIBRARY);
      // console.log(checkResult)
      // return true
      const checkResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (checkResult === RESULTS.GRANTED) {
        return true;
      }
      if (checkResult === RESULTS.BLOCKED) {
        Alert.alert(
          '',
          "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
        );
        return false;
      }
      if (checkResult === RESULTS.UNAVAILABLE) {
        Alert.alert('', 'Access to storage is unavailable.');
        return false;
      }

      if (checkResult === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (requestResult === RESULTS.GRANTED) {
          return true;
        }

        if (requestResult === RESULTS.BLOCKED) {
          Alert.alert(
            '',
            "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
          );
          return false;
        }
      }
    },
  });

  const DownloadQRCode = async () => {
    const result = await checkAndRequest();

    const pathCache = RNFS.CachesDirectoryPath;

    viewshotRef.current.capture().then(async uri => {
      const timestamp = +moment();
      const filename = `${timestamp.toString()}_${tokwaAccount.mobileNumber}.png`;

      RNFS.moveFile(uri, pathCache + `/${filename}`);
      const newFileUri = `${pathCache}/${filename}`;

      await CameraRoll.save(newFileUri, {type: 'photo', album: 'toktok'});
      Toast.show(`QRCode ${filename} has been downloaded.`, Toast.LONG);
    });
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          marginTop: 10,
          width: 280,
          height: 320,
          borderTopWidth: 1,
          borderTopColor: '#ededed',
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
        }}>
        <View style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
          {loading && (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator color={COLOR.YELLOW} size={50} />
            </View>
          )}

          {qrcode && !loading && (
            <>
              <ViewShot
                ref={viewshotRef}
                style={{
                  backgroundColor: 'white',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  width: '80%',
                }}
                options={{format: 'png', 'width/height': 1100 / 800, result: 'tmpfile'}}>
                <QRCode
                  value={qrcode} //Give value when there's no session as it will throw an error if value is empty.
                  // size={width * 0.7}
                  logo={tokwaLogo}
                  logoSize={50}
                  logoBackgroundColor="transparent"
                  size={180}
                  color="black"
                  backgroundColor="transparent"
                  // onPress={() => alert('Pressed')}
                />

                <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>
                    {tokwaAccount.person.firstName} {tokwaAccount.person.lastName}
                  </Text>
                  <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{tokwaAccount.mobileNumber}</Text>
                </View>
              </ViewShot>
            </>
          )}
        </View>
        <ReceiptSeparator bottomHeight={40} roundLeftStyle={styles.leftCircle} roundRightStyle={styles.rightCircle} />
        <View style={styles.brokenLine}>
          <DashedLine dashColor={COLOR.ORANGE} dashThickness={Platform.OS === 'ios' ? 1 : -1} />
        </View>
        <TouchableOpacity
          onPress={DownloadQRCode}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 25,
            height: 65,
            backgroundColor: 'transparent',
            borderTopWidth: 3,
            borderStyle: 'dotted',
            borderTopColor: 'orange',
          }}>
          <FIcon name="download" size={FONT_SIZE.M + 5} color={'#FF8A48'} />
          <Text style={{color: COLOR.ORANGE, fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, marginLeft: 5}}>
            Download QR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCode: {
    width: 280,
    height: 320,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 10,
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  label: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  leftCircle: {
    overflow: 'hidden',
    left: Platform.OS === 'android' ? -1.6 : -2,
    borderTopColor: '#ededed',
    borderTopWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderRightWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderLeftColor: 'white',
    borderRightColor: '#ededed',
    borderBottomWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderBottomColor: '#ededed',
    backgroundColor: 'white',
  },
  rightCircle: {
    overflow: 'hidden',
    right: Platform.OS === 'android' ? -1 : -2,
    backgroundColor: 'white',
    borderTopColor: '#ededed',
    borderTopWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderLeftWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderLeftColor: '#ededed',
    borderBottomWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderBottomColor: '#ededed',
    borderRightColor: 'white',
  },
  brokenLine: {
    marginHorizontal: moderateScale(25),
  },
});
