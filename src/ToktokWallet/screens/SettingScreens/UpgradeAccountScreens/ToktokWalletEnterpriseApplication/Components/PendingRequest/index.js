import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {bank_icon} from 'toktokwallet/assets';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const PendingRequest = ({enterpriseRequest}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Upgrade Account</Text>
      <Text style={styles.fontRegularStyle}>
        Meet the following requirements for upgrading your account to Enterprise.
      </Text>
      <View style={[styles.cardShadow, styles.cardStyle]}>
        <Image source={bank_icon} style={styles.img} />
        <View style={{marginLeft: 15, flexShrink: 1}}>
          <Text style={[styles.fontRegularStyle]}>
            Your business documents have been submitted. Wait for further notifications as our representative assesses
            your application.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  headerTitle: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    marginBottom: 10,
  },
  fontRegularStyle: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
  },
  fontBoldStyle: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  linkNow: {
    fontSize: FONT_SIZE.XS,
    color: COLOR.ORANGE,
  },
  cardShadow: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardStyle: {
    padding: 20,
    marginVertical: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonStyle: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLOR.ORANGE,
  },
  img: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
  },
});
