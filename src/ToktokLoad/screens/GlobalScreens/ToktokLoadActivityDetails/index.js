import React, {useState} from 'react';
import {Platform, StyleSheet, View, Text, Image} from 'react-native';
import moment from 'moment';

// Components
import {HeaderBack, HeaderTitle, Separator} from 'toktokbills/components';
import {VectorIcon, ICON_SET} from 'src/revamp';

// Helpers
import {moderateScale, currencyCode, numberFormat} from 'toktokbills/helper';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import {paper_airplane_icon} from 'toktokbills/assets/icons';
import {toktokwallet_logo} from 'toktokbills/assets/images';

const getStatus = status => {
  //	1 = successful; 2 = pending; 3 = failed
  switch (status) {
    case 1:
      return {text: 'Success', color: '#F6841F', iconName: 'ios-paper-plane-outline'};
    case 3:
      return {text: 'Failed', color: '#ED3A19', iconName: 'close-circle-outline'};

    default:
      return {text: 'Pending', color: '#FDBA1C', iconName: 'remove-circle-outline'};
  }
};

export const ToktokLoadActivityDetails = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Load Details'} labelStyle={{fontSize: moderateScale(FONT_SIZE.XL + 3)}} />,
  });

  const {
    amount,
    convenienceFee,
    createdAt,
    destinationNumber,
    loadDetails,
    referenceNumber,
    status,
    toktokwalletReturnRefNo,
  } = route.params?.activityDetails;
  const transactionDateTime = moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  const totalAmount = `₱${numberFormat(parseFloat(amount) + parseFloat(convenienceFee))}`;
  const statusData = getStatus(status);

  return (
    <View style={styles.container}>
      <View style={styles.detailOneContainer}>
        <View style={styles.headerContainer}>
          <Text>
            <Text style={{fontFamily: FONT.BOLD}}>Service Reference Number </Text>
            <Text style={styles.referenceNumber}>{referenceNumber}</Text>
          </Text>
        </View>
        <View style={styles.rowAlignItemsCenter}>
          {statusData.text == 'Success' ? (
            <Image source={paper_airplane_icon} style={styles.successIcon} />
          ) : (
            <VectorIcon
              size={moderateScale(15)}
              iconSet={ICON_SET.Ionicon}
              color={statusData.color}
              name={statusData.iconName}
            />
          )}
          <Text style={[styles.statusText]}>{statusData.text}</Text>
        </View>
      </View>
      <View style={styles.billInfo}>
        <View style={styles.loadInfoContainer}>
          <View>
            <Text style={styles.fontBigBold}>Load Information</Text>
            <Text style={styles.transactionDateTime}>{transactionDateTime}</Text>
          </View>
          <Image source={toktokwallet_logo} style={styles.walletLogo} />
        </View>
        <View style={styles.separator} />
        <View style={styles.networkContainer}>
          <Image source={{uri: loadDetails?.networkDetails.iconUrl}} style={styles.networkIcon} />
          <View style={styles.billerDetails}>
            <Text style={styles.network}>{loadDetails?.networkDetails.name}</Text>
            <Text style={styles.mobileNumber}>{destinationNumber}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={{paddingVertical: moderateScale(16)}}>
          <View style={{marginBottom: moderateScale(10)}}>
            <View style={styles.breakdownContainer}>
              <Text>Load Amount</Text>
              <Text>
                {currencyCode}
                {numberFormat(amount)}
              </Text>
            </View>
            <View style={styles.breakdownContainer}>
              <Text>Service Fee</Text>
              <Text>
                {currencyCode}
                {numberFormat(convenienceFee)}
              </Text>
            </View>
          </View>
          <View style={styles.breakdownContainer}>
            <Text style={styles.mediumBoldOrange}>Total</Text>
            <View style={styles.rowAlignItemsCenter}>
              <Text style={[styles.mediumBoldOrange]}>{totalAmount}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusText: {
    paddingLeft: moderateScale(5),
  },
  separator: {
    backgroundColor: '#F8F8F8',
    height: 2,
  },
  mobileNumber: {
    fontSize: FONT_SIZE.S,
    color: '#525252',
  },
  billInfo: {
    padding: moderateScale(16),
  },
  loadInfoContainer: {
    paddingBottom: moderateScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontBigBold: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  transactionDateTime: {
    fontSize: FONT_SIZE.S,
    color: '#525252',
    marginVertical: moderateScale(5),
  },
  rowAlignItemsCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletLogo: {
    width: moderateScale(110),
    height: moderateScale(40),
    resizeMode: 'contain',
  },
  mediumBoldOrange: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: '#F6841F',
  },
  accountInfo: {
    marginBottom: moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountColor: {
    color: '#525252',
  },
  breakdownContainer: {
    marginBottom: moderateScale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  network: {
    fontSize: FONT_SIZE.M,
  },
  networkIcon: {
    width: moderateScale(60),
    height: moderateScale(30),
    resizeMode: 'contain',
  },
  networkContainer: {
    paddingVertical: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    flexShrink: 1,
    marginRight: moderateScale(10),
  },
  detailOneContainer: {
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    backgroundColor: '#FFFCF4',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowAlignItemsCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    resizeMode: 'contain',
    height: moderateScale(15),
    width: moderateScale(15),
  },
  referenceNumber: {
    color: '#FDBA1C',
    fontFamily: FONT.BOLD,
  },
  billerDetails: {
    paddingLeft: moderateScale(10),
    flexShrink: 1,
  },
  mobileNumber: {
    fontSize: FONT_SIZE.S,
    color: '#525252',
  },
});
