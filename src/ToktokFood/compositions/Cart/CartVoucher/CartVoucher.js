/* eslint-disable no-shadow */
/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import type {PropsType} from './types';
import {
  Container,
  Image,
  Row,
  ApplyButton,
  VouchersContainer,
  VoucherContainer,
  VoucherText,
  Icon,
  Input,
  Column,
  VoucherErrorText,
} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import {carbon_voucher_ticket} from 'toktokfood/assets/images';
import {useSelector, useDispatch} from 'react-redux';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_VOUCHER_CODE} from 'toktokfood/graphql/toktokfood';
import {useLazyQuery} from '@apollo/react-hooks';
import _ from 'lodash';

const parseAmountComputation = async cartItem => {
  let sVoucher = [];
  return Promise.all(
    cartItem.map(item => {
      const {basePrice, quantity, productid} = item;
      delete item.__typename;

      sVoucher.push({
        product_id: productid,
        amount: basePrice,
        srp_amount: basePrice,
        srp_totalamount: Number(basePrice.toFixed(2)) * quantity,
        total_amount: Number(basePrice.toFixed(2)) * quantity,
        quantity: quantity,
      });
    }),
  ).then(() => {
    return sVoucher;
  });
};

const CartVoucher = (props: PropsType): React$Node => {
  const {
    paymentMethod = 'toktokwallet',
    cartItems = [],
    totalAmount = 0,
    deliveryFee = 0,
    errorVoucherMessage = '',
    setErrorVoucherMessage = string => null,
  } = props;
  const {promotionVoucher, customerInfo, loader} = useSelector(state => state.toktokFood);
  const dispatch = useDispatch();
  const [voucherCode, setVoucherCode] = useState('');

  const [validateVoucherCode] = useLazyQuery(GET_VOUCHER_CODE, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onError: err => console.log(JSON.stringify(err)),
    onCompleted: ({getVoucherCode}) => {
      const {success, message} = getVoucherCode;
      console.log('getVoucherCode', getVoucherCode);
      if (!success) {
        setErrorVoucherMessage(message);
        const filterPromo = promotionVoucher.filter(promo => promo.type !== 'promotion' && promo.type !== 'shipping');
        const filterPromotions = promotionVoucher.filter(promo => promo.type === 'promotion');
        dispatch({
          type: 'SET_TOKTOKFOOD_PROMOTIONS',
          payload: _.unionBy(filterPromo, filterPromotions, 'id'),
        });
        const payload = {...loader, isVisible: false};
        dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      } else {
        const {voucher} = getVoucherCode;
        const filterPromo = promotionVoucher.filter(promo => promo.id !== voucher.id);
        const {amount, is_percentage, on_top} = voucher;
        let totalDeliveryFee = 0;
        const filterDeal = promotionVoucher.filter(promo => promo.type === 'deal');
        if ((!on_top && !filterDeal.length) || (on_top && !filterDeal.length) || (on_top && filterDeal[0].on_top > 0)) {
          if (amount > 0) {
            const pAmount = is_percentage > 0 ? (amount / 100) * deliveryFee : amount;
            const totalFee = pAmount > deliveryFee ? deliveryFee : pAmount;
            totalDeliveryFee = totalFee;
          } else {
            totalDeliveryFee = deliveryFee;
          }

          const voucherObj = [...filterPromo, {...voucher, origAmount: amount, amount: totalDeliveryFee}];
          dispatch({
            type: 'SET_TOKTOKFOOD_PROMOTIONS',
            payload: voucherObj,
          });
          const payload = {...loader, text: 'Voucher Applied', type: 'success'};
          dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
        } else {
          setErrorVoucherMessage(
            '* Oops! Voucher was not applied for this order. Please review details of voucher and try again.',
          );
          const payload = {...loader, isVisible: false};
          dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
        }
      }
      setVoucherCode('');
    },
  });

  const onlySpaces = str => str.trim().length === 0;

  const onApplyVoucher = async () => {
    if (voucherCode.length === 0 || onlySpaces(voucherCode)) {
      return;
    }
    const promoCount = 0;
    const orders = await parseAmountComputation(cartItems);
    const payload = {isVisible: true, text: 'Applying Voucher', type: null};
    dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
    validateVoucherCode({
      variables: {
        input: {
          userId: Number(customerInfo.userId),
          brandId: cartItems[0].companyId,
          shopid: cartItems[0]?.shopid,
          code: voucherCode,
          region: cartItems[0]?.shopRegion,
          subtotal: totalAmount,
          paymentMethod: paymentMethod === 'cash' ? 'COD' : paymentMethod.toUpperCase(),
          promoCount,
          orders,
        },
      },
    });
  };

  const onRemoveVoucher = id => {
    const payload = {isVisible: true, text: 'Removing Voucher', type: null};
    dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
    setTimeout(() => {
      const filterData = promotionVoucher.filter(item => item.id !== id);
      if (filterData.length < promotionVoucher.length) {
        const payload = {isVisible: true, text: 'Voucher Removed', type: 'success'};
        dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
        dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: filterData});
      }
    }, 2000);
  };

  const renderActiveVouchersComponent = () => {
    if (promotionVoucher?.length > 0) {
      return (
        <VouchersContainer>
          {promotionVoucher.map(activeVoucher => (
            <VoucherContainer type={activeVoucher?.type}>
              <VoucherText>{activeVoucher?.vname}</VoucherText>
              {activeVoucher?.type !== 'auto' && activeVoucher?.type !== 'deal' && (
                <Icon name="close" size={14} onPress={() => onRemoveVoucher(activeVoucher?.id)} />
              )}
            </VoucherContainer>
          ))}
        </VouchersContainer>
      );
    }
  };

  return (
    <Container>
      <Row marginBottom={15}>
        <Image source={carbon_voucher_ticket} />
        <StyledText>Vouchers</StyledText>
      </Row>
      {renderActiveVouchersComponent()}
      <Row apply>
        <Column>
          <Input
            autoCapitalize="characters"
            placeholder="Enter voucher code (optional)"
            value={voucherCode}
            onChangeText={text => {
              setErrorVoucherMessage('');
              setVoucherCode(text.toUpperCase());
            }}
            error={errorVoucherMessage}
            onSubmitEditing={onApplyVoucher}
          />
          {errorVoucherMessage.length > 0 && <VoucherErrorText>{errorVoucherMessage}</VoucherErrorText>}
        </Column>
        <TouchableOpacity activeOpacity={0.9} onPress={onApplyVoucher}>
          <ApplyButton>Apply</ApplyButton>
        </TouchableOpacity>
      </Row>
    </Container>
  );
};

export default CartVoucher;
