import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {HeaderBack, HeaderTitle} from '../../../components';
import {numberFormat} from '../../../helper';
import CashIcon from '../../../assets/images/CashIcon.png';
import InfoIcon from '../../../assets/images/info.png';
import moment from 'moment';
import ToktokWalletOutline from '../../../assets/images/toktok-wallet-outline.png';

const ToktokGoPaymentDetails = ({navigation, route}) => {
  const {booking} = route.params;
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Payment Details', '']} />,
  });

  const cancelledStatus = booking.logs.find(item => item.status == 'CANCELLED');

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
          {booking.fare?.vouchers?.length > 0 && (
            <>
              <View style={styles.elementWrapper}>
                <Text style={styles.higlighttextStyle}>Voucher</Text>
                <Text style={styles.voucherTextStyle}>- ₱{numberFormat(booking.fare.discount)}</Text>
              </View>

              <View style={styles.elementWrapper}>
                <Text style={styles.textStyle}>{booking.fare.vouchers[0].name}</Text>
              </View>
            </>
          )}

          <View style={styles.divider} />
          {booking.cancellationChargeStatus == 'PAID' && (
            <>
              <View style={styles.elementWrapper}>
                <Text style={styles.textStyle}>Outstanding Fee</Text>
                <Text style={styles.textStyle}>₱{numberFormat(50)}</Text>
              </View>
              <View style={styles.elementWrapper}>
                <Text style={styles.textStyle}>
                  {booking.cancellation.initiatedBy == 'CONSUMER' ? 'Cancellation Fee' : 'No Show Fee'} last{' '}
                  {moment(cancelledStatus.createdAt).format('MMM D, YYYY')}
                </Text>
              </View>
            </>
          )}
          <View style={styles.elementTotal}>
            <Text style={styles.bottomTextStyle}>{booking.tag == 'ONGOING' ? 'Total' : 'Total Paid'}</Text>

            <Text style={styles.bottomTextStyle}>₱{numberFormat(booking.fare.total)}</Text>
          </View>
          <View style={styles.divider} />
        </View>
      ) : (
        <>
          {booking.cancellationChargeStatus == 'PAID' && (
            <>
              <View style={styles.elementWrapper}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.higlighttextStyle}>Outstanding Fee</Text>
                  <Image source={InfoIcon} resizeMode={'contain'} style={styles.imgDimensions} />
                </View>
                <Text style={styles.textStyle}>₱{numberFormat(50)}</Text>
              </View>
              <View style={styles.elementWrapper}>
                <Text style={styles.textStyle}>
                  {booking.cancellation.initiatedBy == 'CONSUMER' ? 'Cancellation Fee' : 'No Show Fee'} last{' '}
                  {moment(cancelledStatus.createdAt).format('MMM D, YYYY')}
                </Text>
              </View>
            </>
          )}
          <View style={styles.divider} />
          <View style={styles.elementTotal}>
            <Text style={styles.bottomTextStyle}>{booking.tag == 'ONGOING' ? 'Total' : 'Total Paid'}</Text>
            <Text style={styles.bottomTextStyle}>₱{booking.cancellationChargeStatus == 'PAID' ? '50.00' : '0.00'}</Text>
          </View>
          <View style={styles.divider} />
        </>
      )}
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
  higlighttextStyle: {
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
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
  imgDimensions: {
    width: 13,
    height: 13,
    marginLeft: 8,
  },
});
