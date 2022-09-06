import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Linking} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const HeaderReminders = () => {
  return (
    <>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://wallet.toktok.ph/privacy-policy')}
        style={styles.policyView}>
        <View>
          <Image
            style={styles.policyIcon}
            source={require('toktokwallet/assets/icons/walletVerify.png')}
            resizeMode="contain"
          />
        </View>
        <View style={styles.privacyPolicyContainer}>
          <Text style={styles.detailsText}>
            All your details are protected in accordance with our{' '}
            <Text style={styles.privacyPolicy}>Privacy Policy.</Text>
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.headingUpload}>
        <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD}}>Upload Documents</Text>
        <Text style={{fontFamily: FONT.REGULAR, marginTop: 10, fontSize: FONT_SIZE.S, color: '#525252'}}>
          Upload the following documents for upgrading your account to
          <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S}}> Enterprise.</Text>
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headingUpload: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
  },
  headingUploadText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  policyView: {
    flexDirection: 'row',
    backgroundColor: '#FFFCF4',
    padding: 16,
    alignItems: 'center',
  },
  policyIcon: {
    height: 21,
    width: 21,
    alignSelf: 'center',
  },
  privacyPolicyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsText: {
    marginHorizontal: moderateScale(10),
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
    color: COLOR.ORANGE,
  },
  privacyPolicy: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.SEMI_BOLD,
    textDecorationLine: 'underline',
  },
});
