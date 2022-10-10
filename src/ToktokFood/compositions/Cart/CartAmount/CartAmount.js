/* eslint-disable no-nested-ternary */
/**
 * @format
 * @flow
 */

import React, {useState, useEffect, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import type {PropsType} from './types';
import {Container, Row, AmountText, DividerContainer, Icon} from './Styled';
import {useGetDeliveryFee} from 'toktokfood/hooks';
import Divider from 'toktokfood/components/Divider';
import Alert from 'toktokfood/components/Alert';
import {useTheme} from 'styled-components';
import ContentLoader from 'react-native-easy-content-loader';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import {getTotalResellerDiscount, getResellerDiscount} from 'toktokfood/helper/cart';

const CartAmount = (props: PropsType): React$Node => {
  const {
    subTotal = 0,
    paymentMethod = 'toktokwallet',
    cartItems = [],
    shippingType = 'Delivery',
    totalAmount = 0,
    srpTotalAmount = 0,
    pabiliShopDetails = {},
    pabiliShopServiceFee = 0,
    pabiliShopResellerDiscount = 0,
    setCartTotalAmount,
    setCartDeliveryInfo,
  } = props;
  const {promotionVoucher} = useSelector(s => s.toktokFood);
  const theme = useTheme();
  const [showDiscount, setShowDiscount] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [cartSubTotalAmount, setCartSubTotalAmount] = useState(0);
  const [resellerDiscount, setResellerDiscount] = useState(0);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [totalDelivery, setTotalDelivery] = useState(0);
  const [totalShipping, setTotalShipping] = useState(0);
  const {state, loading} = useGetDeliveryFee(shippingType, cartItems, totalAmount, paymentMethod);

  const getVoucherDiscounts = useCallback(async () => {
    const groupPromo = _(promotionVoucher)
      .groupBy('type')
      .map((objs, key) => ({
        amount: _.sumBy(objs, 'amount'),
        discount_totalamount: _.sumBy(objs, 'discount_totalamount'),
        type: key,
      }))
      .value();

    console.log('groupPromo', groupPromo);

    const groupedPromotions = groupPromo.filter(promo => promo.type === 'promotion');
    const groupedDeal = groupPromo.filter(promo => promo.type === 'deal');
    const autoApply = groupPromo.filter(promo => promo.type === 'auto');
    const shipping = groupPromo.filter(promo => promo.type === 'shipping');

    if (groupedPromotions.length > 0 || groupedDeal.length > 0) {
      const promotions = promotionVoucher.filter(promo => promo.type === 'promotion');
      const deal = promotionVoucher.filter(promo => promo.type === 'deal');
      const totalBasketAmount = await getTotalResellerDiscount([...promotions, ...deal], cartItems);
      setResellerDiscount(totalBasketAmount);

      console.log('promotions', promotions);
      const totalResellerDisc = await getResellerDiscount(promotions, deal, cartItems);
      setTotalPromotions(totalResellerDisc);
      console.log('totalResellerDisc', totalResellerDisc);
      setCartSubTotalAmount(subTotal + (srpTotalAmount - totalAmount));
    } else {
      const getResDiscount = pabiliShopDetails.isShopPabiliMerchant ? 0 : srpTotalAmount - totalAmount;
      setCartSubTotalAmount(subTotal + (srpTotalAmount - totalAmount));
      setResellerDiscount(getResDiscount);
      setTotalPromotions(0);
    }

    if (shipping.length > 0) {
      setTotalDelivery(shipping[0].amount > 0 ? shipping[0].amount : state?.price);
    } else {
      setTotalDelivery(0);
    }

    if (autoApply.length > 0) {
      const {amount} = autoApply[0];
      setTotalShipping(amount > 0 ? amount : state?.price);
    } else {
      setTotalShipping(0);
    }
  }, [cartItems, pabiliShopDetails, promotionVoucher, srpTotalAmount, state, subTotal, totalAmount]);

  const getGrossDeliveryFee = useCallback(() => {
    let total = 0;
    if (shippingType === 'Delivery') {
      const totalSumSF = totalDelivery + totalShipping;
      total = totalSumSF > state?.price ? state?.price : totalSumSF;
    }
    return total;
  }, [shippingType, state?.price, totalDelivery, totalShipping]);

  const getGrossTotal = useCallback(() => {
    let TOTAL = 0;
    const serviceFeeDiscount =
      pabiliShopDetails?.isShopPabiliMerchant && pabiliShopResellerDiscount > 0
        ? pabiliShopServiceFee - pabiliShopResellerDiscount
        : resellerDiscount;
    const shippingFee = getGrossDeliveryFee();
    const sfAmount = shippingType === 'Delivery' ? state?.price - shippingFee : 0;
    TOTAL = cartSubTotalAmount + pabiliShopServiceFee + sfAmount - serviceFeeDiscount - totalPromotions;
    return TOTAL;
  }, [
    cartSubTotalAmount,
    getGrossDeliveryFee,
    pabiliShopDetails?.isShopPabiliMerchant,
    pabiliShopResellerDiscount,
    pabiliShopServiceFee,
    resellerDiscount,
    shippingType,
    state?.price,
    totalPromotions,
  ]);

  useEffect(() => {
    setCartSubTotalAmount(subTotal + resellerDiscount);
  }, [resellerDiscount, subTotal]);

  useEffect(() => {
    getVoucherDiscounts();
  }, [getVoucherDiscounts, cartItems]);

  useEffect(() => {
    setCartTotalAmount(getGrossTotal());
  }, [getGrossTotal, setCartTotalAmount]);

  useEffect(() => {
    if (shippingType === 'Delivery') {
      setCartDeliveryInfo({...state, deliveryFeeDiscount: getGrossDeliveryFee()});
    } else {
      setCartDeliveryInfo({});
    }
  }, [getGrossDeliveryFee, setCartDeliveryInfo, shippingType, state]);

  const renderAmountComponent = (type = '', sign = '', title, amount, icon, onPress) => (
    <TouchableOpacity activeOpacity={0.9} disabled={icon ? false : true} onPress={onPress}>
      <Row>
        <Row>
          <AmountText title={title} type={type}>
            {title}
          </AmountText>
          {icon && <Icon name={icon} size={15} color={icon === 'info' ? theme.color.orange : theme.color.black} />}
        </Row>
        {isNaN(amount) && title !== 'Service Fee' ? (
          <Row position="absolute" right={-10}>
            <ContentLoader active title={false} pRows={1} pWidth={50} pHeight={13} />
          </Row>
        ) : typeof amount === 'number' ? (
          <AmountText title={title} sign={sign}>
            {sign}&#x20B1;{parseFloat(amount).toFixed(2)}
          </AmountText>
        ) : (
          <AmountText title={title} sign={sign}>
            {amount}
          </AmountText>
        )}
      </Row>
    </TouchableOpacity>
  );

  const renderDiscountComponent = () => {
    const serviceFeeDiscount =
      pabiliShopDetails?.isShopPabiliMerchant && pabiliShopResellerDiscount > 0
        ? pabiliShopServiceFee - pabiliShopResellerDiscount
        : resellerDiscount;

    const discountTotal = totalPromotions + serviceFeeDiscount + getGrossDeliveryFee();
    if (discountTotal > 0) {
      return (
        <React.Fragment>
          {renderAmountComponent(
            '',
            '-',
            'Discounts',
            discountTotal,
            showDiscount ? 'chevron-down' : 'chevron-up',
            () => setShowDiscount(!showDiscount),
          )}
          {showDiscount && (
            <React.Fragment>
              {resellerDiscount > 0 &&
                !pabiliShopDetails?.isShopPabiliMerchant &&
                renderAmountComponent('discount', '-', 'Reseller', serviceFeeDiscount)}
              {(totalPromotions > 0 || totalDelivery > 0 || totalShipping > 0) &&
                promotionVoucher.map(activeVoucher =>
                  renderAmountComponent(
                    'discount',
                    '-',
                    activeVoucher?.vname,
                    activeVoucher?.discount_totalamount ?? activeVoucher?.amount,
                  ),
                )}
              {pabiliShopDetails?.isShopPabiliMerchant &&
                serviceFeeDiscount > 0 &&
                renderAmountComponent('discount', '-', 'Service Fee (Reseller)', serviceFeeDiscount)}
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }
    return null;
  };

  const renderAlertComponent = () => (
    <Alert
      isVisible={isAlertVisible}
      subtitle="This fee is for us to continue providing
      excellent delivery experience along with
      better promos and to expand our
      merchants selection."
      buttonText="OK"
      onPress={() => setIsAlertVisible(false)}
    />
  );

  return (
    <Container>
      {renderAmountComponent('', '', 'Subtotal', cartSubTotalAmount)}
      {pabiliShopDetails?.isShopPabiliMerchant &&
        renderAmountComponent('', '', 'Service Fee', pabiliShopServiceFee || 'Waived', 'info', () =>
          setIsAlertVisible(true),
        )}
      {shippingType === 'Delivery' && renderAmountComponent('', '', 'Delivery Fee', state?.price)}
      {renderDiscountComponent()}
      <DividerContainer>
        <Divider />
      </DividerContainer>
      {renderAmountComponent('', '', 'Total', getGrossTotal())}
      {renderAlertComponent()}
    </Container>
  );
};

export default CartAmount;
