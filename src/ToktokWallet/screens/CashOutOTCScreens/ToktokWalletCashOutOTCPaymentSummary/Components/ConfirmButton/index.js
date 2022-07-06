import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//UTIL
import {moderateScale, numberFormat} from 'toktokwallet/helper';
import {ErrorUtility} from 'toktokbills/util';

//GRAPHQL & HOOKS
import {useAccount} from 'toktokbills/hooks';
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_BILLS_TRANSACTION, POST_TOKTOKWALLET_REQUEST_MONEY} from 'toktokbills/graphql/model';
import {usePrompt} from 'src/hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert, useThrottle} from 'src/hooks';
import {useSelector} from 'react-redux';

//COMPONENTS
import {OrangeButton, SplashLoading} from 'toktokbills/components';
import {AlertOverlay} from 'src/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

export const ConfirmButton = ({}) => {

  return (
    <>
      {/* <AlertOverlay visible={loading || postBillsTransactionLoading} /> */}
      <View style={styles.container}>
        <Text style={styles.terms}>
          <Text style={styles.footerText}>Please review the accuracy of the details provided and read our </Text>
          <Text style={[styles.tnc, styles.footerText]}>
            Terms and Conditions{' '}
          </Text>
          <Text style={styles.footerText}>before you proceed with your transaction.</Text>
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <OrangeButton label="Confirm" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
  },
  terms: {
    textAlign: 'left',
    marginBottom: moderateScale(15),
    fontSize: FONT_SIZE.S,
  },
  tnc: {
    color: '#F6841F',
  },
  paymentPolicy1: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
  },
  paymentPolicy2: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
    marginBottom: moderateScale(30),
    marginTop: moderateScale(10),
  },
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
  footerText: {
    fontSize: FONT_SIZE.S,
  },
});