/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Text, View, TextInput} from 'react-native';
import {useSelector} from 'react-redux';
import _ from 'lodash';

import styles from '../styles';
import YellowButton from 'toktokfood/components/YellowButton';
import {VerifyContext} from './VerifyContextProvider';
import CONSTANTS from 'common/res/constants';
const {COLOR} = CONSTANTS;

import {verticalScale} from 'toktokfood/helper/scale';

const RiderNotes = ({
  onNotesChange,
  notes = '',
  onPlaceOrder,
  showPlaceOrder = false,
  forDelivery = true,
  disableWalletCheckout = true,
  deliveryFee = 0,
  orderType,
}) => {
  const navigation = useNavigation();
  const {toktokWallet, temporaryCart, paymentMethod} = useContext(VerifyContext);
  const {customerWallet, promotionVoucher} = useSelector(state => state.toktokFood);
  const [totalAmount, setTotalAmount] = useState(temporaryCart?.totalAmount);

  const isDisabled =
    paymentMethod == 'TOKTOKWALLET'
      ? forDelivery
        ? totalAmount > toktokWallet?.balance
        : false
      : totalAmount - deliveryFee > toktokWallet?.balance;

  // const onPlaceOrderNavigate = () => {
  //   navigation.replace('ToktokFoodDriver');
  // };

  // console.log('disableWalletCheckout', disableWalletCheckout);

  const onValidateAmount = useCallback(() => {
    if (deliveryFee) {
      const deliveryFeeTotal = forDelivery ? deliveryFee : 0;
      let totalAmt = 0;
      const groupPromo = _(promotionVoucher)
        .groupBy('type')
        .map((objs, key) => ({
          amount: _.sumBy(objs, 'amount'),
          discount_totalamount: _.sumBy(objs, 'discount_totalamount'),
          type: key,
        }))
        .value();
      const promotions = groupPromo.filter(promo => promo.type === 'promotion');
      const deal = groupPromo.filter(promo => promo.type === 'deal');
      if (promotions.length > 0) {
        totalAmt += promotions[0]?.discount_totalamount;
      }
      if (deal.length > 0) {
        totalAmt += deal[0]?.discount_totalamount;
      }
      setTotalAmount(temporaryCart?.totalAmount + deliveryFeeTotal - totalAmt);
    }
  }, [deliveryFee, promotionVoucher]);

  useEffect(() => {
    onValidateAmount();
  }, [onValidateAmount]);

  return (
    <>
      <View style={styles.sectionContainer}>
        {forDelivery && (
          <>
            <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(10)}]}>
              <Text style={styles.sectionTitle}>Note to Driver</Text>
            </View>
            <View>
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.input}
                placeholder="Type your instructions here..."
                value={notes}
                placeholderTextColor={COLOR.MEDIUM}
                onChangeText={v => onNotesChange(v)}
                maxLength={320}
              />
            </View>
          </>
        )}

        <View style={{paddingVertical: 10}}>
          <YellowButton
            onPress={() => {
              onPlaceOrder();
            }}
            label="Place Order"
            disabled={
              isDisabled ||
              (disableWalletCheckout && customerWallet?.status === 2) ||
              !customerWallet ||
              customerWallet?.status === 0
            }
          />
        </View>
      </View>
    </>
  );
};

export default RiderNotes;
