import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator, Platform} from 'react-native';
import {useAccount} from 'toktokwallet/hooks';
import QRCode from 'react-native-qrcode-svg';
import tokwaLogo from 'toktokwallet/assets/images/tokwa.png';
import tokwaLogo2 from 'toktokwallet/assets/images/tokwa2.png';
import CONSTANTS from 'common/res/constants';
import {ReceiptSeparator} from 'toktokwallet/components';
import DashedLine from 'react-native-dashed-line';
import {VerifyContext} from '../../../VerifyContextProvider';
import {currencyCode, numberFormat, moderateScale} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const MyQrCode = ({onCapturingScreen}) => {
  // const viewshotRef = useRef();
  const {tokwaAccount} = useAccount();
  const {amount, generatedQrCode, generateQrCodeLoading} = useContext(VerifyContext);

  return (
    <View style={styles.container}>
      <View style={[styles.contentContainer, Platform.OS === 'android' && styles.qrBorder]}>
        <View style={styles.qrContainer}>
          {generateQrCodeLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLOR.ORANGE} size={50} />
            </View>
          )}
          {generatedQrCode && !generateQrCodeLoading && (
            <>
              <QRCode
                value={generatedQrCode} //Give value when there's no session as it will throw an error if value is empty.
                logo={tokwaLogo}
                logoSize={moderateScale(50)}
                logoBackgroundColor="transparent"
                size={moderateScale(180)}
                color="black"
                backgroundColor="transparent"
              />

              <View style={styles.contentWrapper}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>
                  {tokwaAccount.person.firstName} {tokwaAccount.person.lastName}
                </Text>
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{tokwaAccount.mobileNumber}</Text>
                {amount !== '' && +amount > 0 && (
                  <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>
                    {currencyCode}
                    {numberFormat(amount)}
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
        <ReceiptSeparator
          bottomHeight={moderateScale(42)}
          roundLeftStyle={styles.leftCircle}
          roundRightStyle={styles.rightCircle}
        />
        <View style={styles.brokenLine}>
          <DashedLine dashColor={COLOR.ORANGE} dashThickness={1} />
        </View>
        <View style={styles.logoContainer}>
          <Image source={tokwaLogo2} style={styles.logo} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(60),
  },
  leftCircle: {
    overflow: 'hidden',
    left: Platform.OS === 'android' ? -2 : -2,
    borderTopColor: '#ededed',
    borderTopWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderRightWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderRightColor: '#ededed',
    borderBottomWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderBottomColor: '#ededed',
  },
  rightCircle: {
    overflow: 'hidden',
    right: Platform.OS === 'android' ? -2 : -2,
    borderTopColor: '#ededed',
    borderTopWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderLeftWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderLeftColor: '#ededed',
    borderBottomWidth: Platform.OS === 'android' ? 1.5 : 2,
    borderBottomColor: '#ededed',
  },
  brokenLine: {
    marginHorizontal: moderateScale(27),
  },
  logo: {
    marginTop: moderateScale(20),
    width: moderateScale(102),
    height: moderateScale(23),
    resizeMode: 'contain',
  },
  qrBorder: {
    borderColor: '#ededed',
    borderWidth: 1,
  },
  contentContainer: {
    marginTop: moderateScale(10),
    width: moderateScale(280),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  qrContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    marginTop: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    height: moderateScale(63),
  },
});
