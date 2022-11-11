/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {useFocusEffect} from '@react-navigation/native';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SHIPPING_FEE, GET_AUTO_SHIPPING, GET_PAYMENT_METHOD_VALIDATION} from 'toktokfood/graphql/toktokfood';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';

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

const deleteKeys = data => {
  data.map(promo => {
    if (promo?.items && promo.items.length) {
      promo.items.map(i => delete i.__typename);
    }
    if (promo?.origAmount || promo.origAmount === 0) {
      promo.amount = promo.origAmount;
    }
    delete promo.origAmount;
    return delete promo.__typename;
  });
  return data;
};

export const useGetDeliveryFee = (shippingType, items, totalAmount, paymentMethod) => {
  const [state, setState] = useState({});
  const {customerInfo, location, promotionVoucher, loader} = useSelector(s => s.toktokFood);
  const dispatch = useDispatch();

  const [getPaymentMethodValidation, {data, error, refetch, loading}] = useLazyQuery(GET_PAYMENT_METHOD_VALIDATION, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getPaymentValidation}) => {
      const {message, voucher, success} = getPaymentValidation;
      if (success && message === 'Available vouchers') {
        dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: voucher});
      }
    },
    onError: err => console.log('getPaymentValidation', JSON.stringify(err)),
  });

  const [getPromotions, {loading: loadingShipping}] = useLazyQuery(GET_AUTO_SHIPPING, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: err => console.log('getAutoShipping', err.response),
    onCompleted: ({getAutoShipping}) => {
      const {promotion, voucher} = getAutoShipping;
      const filterPromo = promotionVoucher.filter(promo => promo.type !== 'auto' && promo.type !== 'deal');
      if (getAutoShipping.success) {
        if (voucher && !promotion) {
          dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: [...filterPromo, voucher]});
        }
        if (promotion && !voucher) {
          dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: [...filterPromo, promotion]});
        }
        if (voucher && promotion) {
          dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: [...filterPromo, voucher, promotion]});
        }
      } else {
        if (!voucher || !promotion) {
          dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: filterPromo});
        }
      }

      const payload = {...loader, isVisible: false};
      dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});

      const shipping = promotionVoucher.filter(promo => promo.type === 'shipping');
      const promotions = promotionVoucher.filter(promo => promo.type === 'promotion');

      if (shipping.length > 0 || promotions.length > 0) {
        getPaymentMethodValidation({
          variables: {
            input: {
              paymentMethod,
              shippingvouchers: deleteKeys(shipping),
              vouchers: deleteKeys(promotions),
            },
          },
        });
      }
    },
  });

  const [getDeliverFee] = useLazyQuery(GET_SHIPPING_FEE, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onCompleted: async ({getShippingFee}) => {
      const {email} = customerInfo;
      const orders = await parseAmountComputation(items);
      setState(getShippingFee);
      getPromotions({
        variables: {
          input: {
            region: items[0]?.shopRegion,
            email,
            subtotal: [{shopid: items[0]?.shopid, subtotal: totalAmount}],
            cartItems: [{shopid: items[0]?.shopid, shippingfee: getShippingFee?.price}],
            brandId: items[0].companyId,
            paymentMethod: paymentMethod.toUpperCase(),
            orders,
          },
        },
      });
    },
    onError: err => console.log('getDeliveryFee', JSON.stringify(err)),
  });

  useEffect(() => {
    if (items?.length > 0 && shippingType === 'Delivery') {
      getDeliverFee({
        variables: {
          input: {
            shopid: +items[0]?.shopid,
            date_today: moment().format('YYYY-DD-YYYY'),
            origin_lat: location.latitude,
            origin_lng: location.longitude,
            des_lat: items[0]?.shopLatitude,
            des_lng: items[0]?.shopLongitude,
          },
        },
      });
    }
  }, [getDeliverFee, items, location, shippingType, paymentMethod]);

  return {state, loading};
};
