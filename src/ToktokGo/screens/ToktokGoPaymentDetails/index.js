import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {HeaderBack, HeaderTitle} from '../../../components';
import {numberFormat} from '../../../helper';
import CashIcon from '../../../assets/images/CashIcon.png';
import ToktokWalletOutline from '../../../assets/images/toktok-wallet-outline.png';

const ToktokGoPaymentDetails = ({navigation, route}) => {
  const {booking} = route.params;
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Payment Details', '']} />,
  });

  return (
    <View style={styles.container}>
      <View style={styles.elementWrapper}>
        <Text style={styles.textStyle}>Payment Method</Text>
        {booking.paymentMethod == 'CASH' ? (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
            <Image source={CashIcon} resizeMode="contain" style={{width: 30, height: 16, marginRight: 8}} />
            <Text
              style={{
                fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                color: CONSTANTS.COLOR.YELLOW,
                fontSize: CONSTANTS.FONT_SIZE.M,
              }}>
              Cash
            </Text>
          </View>
        ) : (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
            <Image source={ToktokWalletOutline} resizeMode="contain" style={{width: 17, height: 15, marginRight: 8}} />
            <Text
              style={{
                fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                color: CONSTANTS.COLOR.YELLOW,
                fontSize: CONSTANTS.FONT_SIZE.M,
              }}>
              toktok
              <Text
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  color: CONSTANTS.COLOR.ORANGE,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                }}>
                wallet
              </Text>
            </Text>
          </View>
        )}
      </View>
      {booking.tag != 'CANCELLED' ? (
        <View>
          <View style={styles.elementWrapper}>
            <Text style={styles.textStyle}>Base Fare</Text>
            <Text style={styles.textStyle}>₱{numberFormat(booking.fare.flatRate)}</Text>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.textStyle}>Distance</Text>
            <Text style={styles.textStyle}>₱{numberFormat(booking.fare.mileageFee)}</Text>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.textStyle}>Time</Text>
            <Text style={styles.textStyle}>₱{numberFormat(booking.fare.durationFee)}</Text>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.textStyle}>Surge Charge</Text>
            <Text style={styles.textStyle}>₱{numberFormat(booking.fare.surgeCharge)}</Text>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.textStyle}>Outstanding Fee</Text>
            <Text style={styles.textStyle}>₱{numberFormat(50)}</Text>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.textStyle}>Cancellation Fee last Jan 7,2022</Text>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.textStyle}>Voucher</Text>
            <Text style={styles.voucherTextStyle}>-₱{numberFormat(50)}</Text>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.textStyle}>₱10k NEW USER</Text>
          </View>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.divider} />
      <View style={styles.elementTotal}>
        <Text style={styles.bottomTextStyle}>{booking.tag == 'ONGOING' ? 'Total' : 'Total Paid'}</Text>
        <Text style={styles.bottomTextStyle}>
          ₱{booking.tag == 'CANCELLED' ? '0.00' : numberFormat(booking.fare.amount)}
        </Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

export default ToktokGoPaymentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
  elementWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  voucherTextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    color: CONSTANTS.COLOR.RED,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  textStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    color: CONSTANTS.COLOR.BLACK,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  bottomTextStyle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    // marginVertical: 16,
  },
  elementTotal: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
});
