import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import {useThrottle} from 'toktokwallet/hooks';
import {moderateScale} from 'toktokwallet/helper';
import {VerifyContext} from '../VerifyContextProvider';
//COLORS AND ASSETS
import CONSTANTS from 'common/res/constants';
const {FONT_FAMILY: FONT} = CONSTANTS;
const qr_code_scan = require('toktokwallet/assets/images/qr-code-scan.png');
const upload_icon = require('toktokwallet/assets/icons/upload2-icon.png');
const generate_qr_icon = require('toktokwallet/assets/icons/generate-qr-icon.png');
const {width} = Dimensions.get('screen');

export const ScanQrOption = ({logo, label, route, handleUploadQr}) => {
  const {qrOptions, setQrOptions} = useContext(VerifyContext);

  const onPressThrottled = useThrottle(() => {
    handleUploadQr();
    // setQrOptions('upload-qr');
  }, 2000);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPressThrottled}
        style={{
          ...styles.uploadContainer,
          ...{
            backgroundColor: qrOptions === 'upload-qr' ? '#F6841F' : '#fff',
          },
        }}>
        <Image
          source={upload_icon}
          style={{
            ...styles.uploadIcon,
            ...{
              tintColor: qrOptions === 'upload-qr' ? '#fff' : '#F6841F',
            },
          }}
        />
        <Text style={{...styles.fontBold, ...{color: qrOptions === 'upload-qr' ? '#fff' : '#F6841F'}}}>Upload QR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setQrOptions('scan')}
        style={{
          ...styles.scanContainer,
          ...{
            backgroundColor: qrOptions === 'scan' ? '#F6841F' : '#fff',
          },
        }}>
        <View style={styles.scanImageContainer}>
          <Image
            source={qr_code_scan}
            style={{
              ...styles.scanIcon,
              ...{
                tintColor: qrOptions === 'scan' ? '#fff' : '#F6841F',
              },
            }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setQrOptions('generate-qr')}
        style={{
          ...styles.generateQrContainer,
          ...{
            backgroundColor: qrOptions === 'generate-qr' ? '#F6841F' : '#fff',
          },
        }}>
        <Image
          source={generate_qr_icon}
          style={{
            ...styles.generateQrIcon,
            ...{
              tintColor: qrOptions === 'generate-qr' ? '#fff' : '#F6841F',
            },
          }}
        />
        <Text style={{...styles.fontBold, ...{color: qrOptions === 'generate-qr' ? '#fff' : '#F6841F'}}}>
          Generate QR
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
    position: 'relative',
  },
  uploadContainer: {
    backgroundColor: 'white',
    flex: 1,
    height: moderateScale(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    width: moderateScale(23),
    height: moderateScale(23),
    resizeMode: 'contain',
  },
  fontBold: {
    fontFamily: FONT.BOLD,
  },
  scanContainer: {
    position: 'absolute',
    left: width / 2.55,
    bottom: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'white',
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: moderateScale(80),
    borderColor: 'orange',
    borderWidth: 1,
  },
  scanImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  scanIcon: {
    width: moderateScale(35),
    height: moderateScale(35),
    resizeMode: 'contain',
  },
  generateQrContainer: {
    backgroundColor: '#F6841F',
    flex: 1,
    height: moderateScale(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateQrIcon: {
    width: moderateScale(25),
    height: moderateScale(25),
    resizeMode: 'contain',
  },
});
