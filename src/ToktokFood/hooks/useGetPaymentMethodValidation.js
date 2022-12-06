/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PAYMENT_METHOD_VALIDATION, GET_AUTO_SHIPPING} from 'toktokfood/graphql/toktokfood';
import {useSelector, useDispatch} from 'react-redux';

export const deleteKeys = data => {
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

export const useGetPaymentMethodValidation = (paymentMethod, items) => {
  const {user} = useSelector(state => state.session);
  const dispatch = useDispatch();
  const {promotionVoucher} = useSelector(state => state.toktokFood);
  const [activeVouchers, setActiveVouchers] = useState([]);
  const [voucherError, setVoucherError] = useState('');

  const shipping = promotionVoucher.filter(promo => promo.type === 'shipping');
  const promotions = promotionVoucher.filter(promo => promo.type === 'promotion');

  const [getPaymentMethodValidation, {data, error, refetch, loading}] = useLazyQuery(GET_PAYMENT_METHOD_VALIDATION, {
    variables: {
      input: {
        paymentMethod,
        shippingvouchers: deleteKeys(shipping),
        vouchers: deleteKeys(promotions),
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({getPaymentValidation}) => {
      const {message, voucher} = getPaymentValidation;
      setActiveVouchers(voucher);
      if (message) {
        setVoucherError(`${message}`);
      }
      dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: voucher});
    },
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

      getPaymentMethodValidation();
    },
  });

  useEffect(() => {
    getPromotions();
  }, [getPromotions, paymentMethod]);

  return {
    activeVouchers,
    voucherError,
    loading,
  };
};
