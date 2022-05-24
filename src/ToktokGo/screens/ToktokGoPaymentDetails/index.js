import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import CONSTANTS from '../../../common/res/constants';
import {HeaderBack, HeaderTitle} from '../../../components';
import {numberFormat} from '../../../helper';
import CashIcon from '../../../assets/images/CashIcon.png';
import ToktokWalletOutline from '../../../assets/images/toktok-wallet-outline.png';

const ToktokGoPaymentDetails = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Payment Details', '']} />,
  });

  const {booking} = useSelector(state => state.toktokGo);

  console.log(booking.fare);

  return (
    <View style={styles.container}>
      <View style={styles.elementWrapper}>
        <Text style={styles.textStyle}>Payment Method</Text>
        {booking.paymentMethod == 'CASH' ? (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
            <Image source={CashIcon} resizeMode="contain" style={{width: 17, height: 15, marginRight: 8}} />
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
      <View style={styles.divider} />
      <View style={styles.elementWrapper}>
        <Text style={styles.bottomTextStyle}>Total</Text>
        <Text style={styles.bottomTextStyle}>₱{numberFormat(booking.fare.amount)}</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

export default ToktokGoPaymentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
  elementWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
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
    marginVertical: 16,
    marginHorizontal: -16,
  },
});
