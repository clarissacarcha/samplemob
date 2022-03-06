import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import _ from 'lodash';

import {VerifyContext} from '../components';

import styles from '../styles';

const OrderTotal = ({autoShipping, subtotal = 0, deliveryFee = 0, forDelivery = true, oneCartTotal}) => {
  // deliveryFee = deliveryFee ? deliveryFee : 0;
  // subtotal = subtotal ? subtotal : 0;
  const {shippingVoucher, temporaryCart} = useContext(VerifyContext);
  const [totalBasket, setTotalBasket] = useState(temporaryCart.totalAmountWithAddons);
  const [totalShipping, setTotalShipping] = useState(0);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [totalDelivery, setTotalDelivery] = useState(0);
  const [totalDeal, setTotalDeal] = useState(0);

  const {promotionVoucher} = useSelector(state => state.toktokFood);

  const totalSumSF = totalDelivery + totalShipping;
  const totalSF = totalSumSF > deliveryFee ? deliveryFee.toFixed(2) : totalSumSF.toFixed(2);

  useEffect(() => {
    oneCartTotal(temporaryCart.totalAmountWithAddons + deliveryFee - totalShipping);
  }, [shippingVoucher, totalBasket, totalShipping]);

  const getVoucherFee = useCallback(() => {
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
    const autoApply = groupPromo.filter(promo => promo.type === 'auto');
    const shipping = groupPromo.filter(promo => promo.type === 'shipping');

    if (promotions.length > 0) {
      setTotalPromotions(promotions[0].discount_totalamount);
      setTotalBasket(temporaryCart.srpTotalAmount);
    } else {
      setTotalPromotions(0);
    }
    if (deal.length > 0) {
      setTotalDeal(deal[0].discount_totalamount);
    } else {
      setTotalDeal(0);
    }
    if (shipping.length > 0) {
      setTotalDelivery(shipping[0].amount);
    } else {
      setTotalDelivery(0);
    }
    if (autoApply.length > 0) {
      const {amount} = autoApply[0];
      if (amount > 0) {
        setTotalShipping(amount);
      } else {
        setTotalShipping(deliveryFee);
      }
    } else {
      setTotalShipping(0);
    }

    // console.log(autoShipping, shippingVoucher)
    // if (autoShipping?.success) {
    //   const {amount, is_percentage} = autoShipping.voucher;
    //   if (amount > 0) {
    //     const pAmount = is_percentage !== '0' ? (amount / 100) * deliveryFee : amount;
    //     const totalFee = pAmount > deliveryFee ? deliveryFee : pAmount;
    //     // let totalSF = deliveryFee - pAmount;
    //     // totalSF = totalSF > 0 ? totalSF : 0;
    //     setTotalShipping(totalFee);
    //   } else {
    //     setTotalShipping(deliveryFee);
    //   }
    // }

    // if (shippingVoucher.length > 0) {
    //   const {type} = shippingVoucher[0];
    //   const {amount, is_percentage} = shippingVoucher[0].voucher;
    //   if (type === 'shipping' && amount > 0) {
    //     let pAmount = is_percentage !== '0' ? (amount / 100) * deliveryFee : amount;
    //     // let totalSF = pAmount > deliveryFee ? pAmount - deliveryFee : deliveryFee - pAmount;
    //     pAmount = pAmount > 0 ? pAmount : 0;
    //     const deliveryAmount = pAmount > deliveryFee ? deliveryFee : pAmount;
    //     setTotalShipping(deliveryAmount);
    //   }
    //   if (type === 'shipping' && amount === 0) {
    //     setTotalShipping(deliveryFee);
    //   }
    //   if (type !== 'shipping') {
    //     const totalBasketDiscount = amount > totalBasket ? amount - totalBasket : totalBasket - amount;
    //     setTotalBasket(totalBasketDiscount);
    //   }
    // } else {
    //   if (!autoShipping?.success) {
    //     setTotalShipping(0);
    //   }
    // }
  }, [promotionVoucher, deliveryFee]);

  useEffect(() => {
    getVoucherFee();
  }, [getVoucherFee]);

  useEffect(() => {
    setTotalBasket(temporaryCart.totalAmountWithAddons);
  }, [temporaryCart]);

  return (
    <View style={[styles.sectionContainer, styles.totalContainer]}>
      {/* {forDelivery && ( */}
      {/* <> */}
      <View style={styles.header}>
        <Text>Subtotal</Text>
        <Text style={styles.subtotal}>{`PHP ${totalBasket?.toFixed(2)}`}</Text>
      </View>
      {(totalPromotions > 0 || totalDeal > 0) && (
        <View style={styles.header}>
          <Text>Item Discount</Text>
          <Text style={styles.subtotal}>{`-PHP ${(totalPromotions + totalDeal).toFixed(2)}`}</Text>
        </View>
      )}

      {forDelivery && (
        <View style={styles.header}>
          <Text>Delivery Fee</Text>
          <View style={styles.deliveryFee}>
            {/* {(autoShipping?.success || shippingVoucher.length > 0) && (
          <Text style={styles.deliveryFeeText}>{`\u20B1${deliveryFee.toFixed(2)}`}</Text>
        )} */}
            <Text style={styles.subtotal}>{`PHP ${deliveryFee.toFixed(2)}`}</Text>
          </View>
        </View>
      )}

      {(totalDelivery > 0 || totalShipping > 0) && (
        <View style={styles.header}>
          <Text>Delivery Fee Discount</Text>
          <Text style={styles.subtotal}>{`-PHP ${totalSF}`}</Text>
        </View>
      )}

      <View style={styles.divider} />
      {/* </> */}
      {/* )} */}
      <View style={styles.header}>
        <Text style={styles.total}>Total</Text>
        {forDelivery ? (
          <Text style={styles.totalPrice}>{`PHP ${(
            totalBasket +
            deliveryFee -
            totalSumSF -
            (totalPromotions + totalDeal)
          ).toFixed(2)}`}</Text>
        ) : (
          <Text style={styles.totalPrice}>{`PHP ${totalBasket - totalSumSF - (totalPromotions + totalDeal)}`}</Text>
        )}
      </View>
    </View>
  );
};

export default OrderTotal;
