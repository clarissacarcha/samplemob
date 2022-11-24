/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {moderateScale, currencyCode} from 'toktokwallet/helper';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
//SELF IMPORTS
import {MyQrCode, EnterAmountModal, RecentQrCodes} from './Components';
import {VerifyContext} from '../VerifyContextProvider';
import {AlertOverlay} from 'src/components';
//ASSETS
import FIcon from 'react-native-vector-icons/Ionicons';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
import moment from 'moment';
import {useAccount} from 'toktokwallet/hooks';

export const GenerateQr = ({navigation, route, viewshotRef, onCapturingScreen}) => {
  const {postGenerateQRCode, recentQrCodes, getAccountQrCodesLoading, setOnShare, onShare} = useContext(VerifyContext);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const {tokwaAccount} = useAccount();

  const onPressGenerateQr = amount => {
    postGenerateQRCode({
      variables: {
        input: {
          amount: parseFloat(amount),
        },
      },
    });
  };

  const DisplayRecentQr = useMemo(() => {
    if (recentQrCodes.length === 0) {
      return null;
    }
    return <RecentQrCodes data={recentQrCodes} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentQrCodes, getAccountQrCodesLoading]);

  const onPressShare = async () => {
    setOnShare(true);
    const pathCache = RNFS.CachesDirectoryPath;
    setTimeout(() => {
      viewshotRef.current.capture().then(async uri => {
        const timestamp = +moment();
        const filename = `${timestamp.toString()}_${tokwaAccount.mobileNumber}.png`;

        RNFS.moveFile(uri, pathCache + `/${filename}`);
        // console.log(`data:image/png;`, uri);
        let shareImageBase64 = {
          type: 'image/jpg',
          title: '',
          url: `data:image/png;base64,${uri}`,
          // subject: 'Share Link', //  for email
        };
        Share.open(shareImageBase64)
          .then(res => {
            setOnShare(false);
          })
          .catch(() => {
            setOnShare(false);
          });
      });
    }, 500);
  };

  return (
    <View style={[styles.container, (onCapturingScreen || onShare) && styles.center]}>
      <AlertOverlay visible={onCapturingScreen} />
      <EnterAmountModal
        visible={showAmountModal}
        setVisible={setShowAmountModal}
        onPressGenerateQr={onPressGenerateQr}
      />
      {!onCapturingScreen && !onShare && (
        <>
          {DisplayRecentQr}
          <View
            style={[
              styles.contentContainer,
              {
                marginTop: recentQrCodes.length === 0 ? moderateScale(30) : 0,
              },
            ]}>
            <TouchableOpacity onPress={() => setShowAmountModal(true)} style={styles.buttonContainer}>
              <Text style={styles.pesoSign}>{currencyCode}</Text>
              <Text style={styles.buttonText}>Enter Amount</Text>
            </TouchableOpacity>
            <View style={{margin: moderateScale(5)}} />
            <TouchableOpacity onPress={onPressShare} style={styles.buttonContainer}>
              <FIcon name="share-social-sharp" size={moderateScale(20)} color="#F6841F" />
              <Text style={styles.buttonText}>Share QR Code</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <MyQrCode onCapturingScreen={onCapturingScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  options: {
    paddingHorizontal: 16,
  },
  center: {
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: moderateScale(20),
  },
  buttonContainer: {
    borderColor: '#F6841F',
    borderWidth: 1,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONT.SEMI_BOLD,
    color: '#F6841F',
    marginLeft: moderateScale(5),
    fontSize: moderateScale(FONT_SIZE.M),
  },
  pesoSign: {
    fontFamily: FONT.SEMI_BOLD,
    color: '#F6841F',
    marginLeft: moderateScale(5),
    fontSize: moderateScale(20),
  },
});
