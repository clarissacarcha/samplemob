/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import _ from 'lodash';

import {VerifyContext} from '../components';

import {getResellerDiscount, getTotalResellerDiscount} from '../functions';

import styles from '../styles';

import {toktokwallet_ic} from 'toktokfood/assets/images';

import MIcon from 'react-native-vector-icons/MaterialIcons';

const OrderTotal = ({
  autoShipping,
  subtotal = 0,
  deliveryFee = 0,
  forDelivery = true,
  onCartTotal,
  onServiceFeeIconPress,
  navigation,
}) => {
  // deliveryFee = deliveryFee ? deliveryFee : 0;
  // subtotal = subtotal ? subtotal : 0;
  const {shippingVoucher, temporaryCart, pabiliShopDetails, pabiliShopServiceFee} = useContext(VerifyContext);
  const [totalBasket, setTotalBasket] = useState(temporaryCart.totalAmountWithAddons);
  const [totalShipping, setTotalShipping] = useState(0);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [totalDelivery, setTotalDelivery] = useState(0);
  const [totalReseller, setTotalReseller] = useState(temporaryCart?.srpTotalAmount - temporaryCart?.totalAmount);
  const [totalDeal, setTotalDeal] = useState(0);

  const {promotionVoucher} = useSelector(state => state.toktokFood);

  const totalSumSF = totalDelivery + totalShipping;
  const totalSF = forDelivery
    ? totalSumSF > deliveryFee
      ? deliveryFee.toFixed(2)
      : totalSumSF.toFixed(2)
    : (0.0).toFixed(2);
  const {pabiliShopResellerDiscount = 0} = temporaryCart;
  // const totalReseller = temporaryCart?.srpTotalAmount - temporaryCart?.totalAmount;

  useEffect(() => {
    onCartTotal(temporaryCart.totalAmountWithAddons + deliveryFee - totalShipping);
  }, [shippingVoucher, totalBasket, totalShipping]);

  const getVoucherFee = async () => {
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

    if (promotions.length > 0 || deal.length > 0) {
      const promotions = promotionVoucher.filter(promo => promo.type === 'promotion');
      const deal = promotionVoucher.filter(promo => promo.type === 'deal');
      const totalBasketAmount = await getTotalResellerDiscount([...promotions, ...deal], temporaryCart.items);
      // setTotalBasket(totalBasketAmount);
      // console.log(totalBasketAmount, 'totalBasketAmount');
      setTotalReseller(totalBasketAmount);
      // setTotalBasket(temporaryCart.totalAmountWithAddons);
    } else {
      const resellerDiscount = pabiliShopDetails.isShopPabiliMerchant
        ? 0
        : temporaryCart?.srpTotalAmount - temporaryCart?.totalAmount;
      setTotalBasket(
        temporaryCart.totalAmountWithAddons + (temporaryCart?.srpTotalAmount - temporaryCart?.totalAmount),
      );
      setTotalReseller(resellerDiscount);
      // setTotalBasket(temporaryCart.totalAmountWithAddons + totalReseller);
      // setTotalReseller(temporaryCart?.srpTotalAmount - temporaryCart?.totalAmount);
    }

    if (promotions.length > 0 || deal.length > 0) {
      // setTotalPromotions(promotions[0].discount_totalamount);
      const promotion = promotionVoucher.filter(promo => promo.type === 'promotion');
      const deals = promotionVoucher.filter(promo => promo.type === 'deal');

      const totalResellerDisc = await getResellerDiscount(promotion, deals, temporaryCart.items);
      // console.log(totalResellerDisc, 'totalResellerDisc');
      setTotalPromotions(totalResellerDisc);
    } else {
      setTotalPromotions(0);
    }
    // if (deal.length > 0) {
    //   // setTotalDeal(deal[0].discount_totalamount);
    //   const deals = promotionVoucher.filter(promo => promo.type === 'deal');
    //   const totalResellerDisc = await getResellerDiscount(deals, temporaryCart.items);
    //   // console.log(totalResellerDisc)
    //   setTotalDeal(totalResellerDisc);
    // } else {
    //   setTotalDeal(0);
    // }
    if (shipping.length > 0) {
      setTotalDelivery(shipping[0].amount > 0 ? shipping[0].amount : deliveryFee);
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
  };

  const onTermsAndConditionsPress = () => {
    navigation.navigate('ToktokFoodTermsAndConditions');
  };

  const ServiceInfoBanner = (
    <View style={styles.pabiliSubInfoWrapper}>
      <Image resizeMode="contain" source={toktokwallet_ic} style={styles.pabiliSubInfoWalletIcon} />
      <View style={{display: 'flex', flexDirection: 'row', maxWidth: '90%'}}>
        <Text style={styles.pabiliSubInfoText} numberOfLines={2}>
          Items prices and availability are subject to change without prior notice. Learn more about our{' '}
          <Text
            onPress={() => onTermsAndConditionsPress()}
            style={[styles.pabiliSubInfoText, {textDecorationLine: 'underline'}]}>
            Terms and Conditions.
          </Text>
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    getVoucherFee();
  }, [promotionVoucher, deliveryFee]);

  useEffect(() => {
    setTotalBasket(temporaryCart.totalAmountWithAddons + totalReseller);
  }, [temporaryCart]);

  const totalAmount = (
    pabiliShopServiceFee -
    pabiliShopResellerDiscount +
    totalBasket +
    deliveryFee -
    totalSumSF -
    totalReseller -
    (totalPromotions + totalDeal)
  ).toFixed(2);
  const deliveryAmount = forDelivery && totalAmount > 0 ? totalAmount : deliveryFee;

  return (
    <>
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
            <Text style={styles.subtotal}>{`-PHP ${(totalPromotions + totalDeal + totalReseller).toFixed(2)}`}</Text>
          </View>
        )}

        {totalPromotions === 0 && totalDeal === 0 && totalReseller > 0 && (
          <View style={styles.header}>
            <Text>Item Discount (Reseller)</Text>
            <Text style={styles.subtotal}>{`-PHP ${totalReseller.toFixed(2)}`}</Text>
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

        {forDelivery && (totalDelivery > 0 || totalShipping > 0) && (
          <View style={styles.header}>
            <Text>Delivery Fee Discount</Text>
            <Text style={styles.subtotal}>{`-PHP ${totalSF}`}</Text>
          </View>
        )}

        {pabiliShopDetails.isShopPabiliMerchant && (
          <>
            <View style={styles.header}>
              <View style={styles.serviceFeeLabelWrapper}>
                <Text>Service Fee</Text>
                <TouchableOpacity onPress={() => onServiceFeeIconPress()}>
                  <MIcon name="info-outline" color="#F6841F" size={22} style={styles.seviceFeeIcon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtotal}>
                {pabiliShopServiceFee > 0 ? `PHP ${pabiliShopServiceFee.toFixed(2)}` : 'WAIVED'}
              </Text>
            </View>

            <View style={styles.header}>
              <View style={styles.serviceFeeLabelWrapper}>
                <Text>Service Fee Discount (Reseller)</Text>
              </View>
              <Text style={styles.subtotal}>
                {pabiliShopResellerDiscount > 0 ? `-PHP ${pabiliShopResellerDiscount.toFixed(2)}` : 'WAIVED'}
              </Text>
            </View>
          </>
        )}

        <View style={styles.divider} />
        {/* </> */}
        {/* )} */}
        <View style={styles.header}>
          <Text style={styles.total}>Total</Text>
          {forDelivery ? (
            <Text style={styles.totalPrice}>{`PHP ${deliveryAmount}`}</Text>
          ) : (
            <Text style={styles.totalPrice}>{`PHP ${(
              totalBasket -
              totalSumSF -
              totalReseller -
              (totalPromotions + totalDeal) +
              pabiliShopServiceFee
            ).toFixed(2)}`}</Text>
          )}
        </View>
      </View>
      {pabiliShopDetails.isShopPabiliMerchant && ServiceInfoBanner}
    </>
  );
};

export default OrderTotal;
