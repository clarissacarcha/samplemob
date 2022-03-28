/**
 * Component used to display a delivery record in my deliveries, orders placed, delivery scheduled and the like
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {constant, throttle} from 'lodash';

//HELPER
import {moderateScale, numberFormat} from 'toktokload/helper';
import moment from 'moment';

//IMAGES & COLOR
import {toktokwallet_logo} from 'toktokload/assets/images';
import Wallet from '../../../assets/images/Wallet.png';
import OnGoing from '../../../assets/icons/OnGoing.png';
import ToktokWalletText from '../../../assets/images/ToktokwalletText.png';

const {COLOR, FONT_SIZE, FONT_FAMILY} = CONSTANTS;
export const ActivityCard = ({item, onPress, isLastItem = false}) => {
  let {
    amount,
    convenienceFee,
    createdAt,
    destinationNumber,
    loadDetails,
    referenceNumber,
    status,
    toktokwalletReturnRefNo,
  } = item;
  let transactionDateTime = moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  let totalAmount = numberFormat(parseFloat(amount) + parseFloat(convenienceFee));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.tabContainer, {marginBottom: moderateScale(isLastItem ? 0 : 16)}]}>
      <View style={[styles.shadow]}>
        <View style={styles.detailOneContainer}>
          <Text>
            Service Reference Number{' '}
            <Text style={{color: '#FDBA1C', fontFamily: FONT_FAMILY.BOLD}}>{referenceNumber}</Text>
          </Text>
          <Text style={styles.subText}>{transactionDateTime}</Text>
        </View>
        <View style={styles.detailTwoContainer}>
          <Image source={{uri: loadDetails?.networkDetails.iconUrl}} style={styles.networkIcon} />
          <View style={{paddingLeft: moderateScale(10), flexShrink: 1}}>
            <Text>{loadDetails?.networkDetails.name}</Text>
            <Text style={styles.subText}>{destinationNumber}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailThreeContainer}>
          <Image source={toktokwallet_logo} style={styles.toktokwalletLogo} />
          <Text style={styles.totalAmount}>Total: ₱{totalAmount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow: {
    backgroundColor: 'white',
    borderRadius: moderateScale(5),
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabContainer: {
    borderRadius: moderateScale(5),
  },
  tokwaButtonTextWrapper: {
    flexDirection: 'row',
  },
  toktokText: {
    color: COLOR.YELLOW,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT_FAMILY.REGULAR,
  },
  walletText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT_FAMILY.REGULAR,
  },
  detailOneContainer: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    backgroundColor: '#FBFAE3',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  subText: {
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  detailTwoContainer: {
    padding: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkIcon: {
    width: moderateScale(40),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  divider: {
    backgroundColor: '#F8F8F8',
    height: 2,
    marginHorizontal: moderateScale(16),
  },
  detailThreeContainer: {
    padding: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toktokwalletLogo: {
    width: moderateScale(110),
    height: moderateScale(40),
    resizeMode: 'contain',
  },
  totalAmount: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT_FAMILY.BOLD,
  },
});
