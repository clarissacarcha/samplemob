/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ALL_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';
import {GET_MY_ACCOUNT} from 'toktokwallet/graphql';

const removeSpecialCharacters = text => text.replace(/[^a-z0-9 ]/gi, '');
const formatMobileNumber = number => (number.charAt(0) === '6' ? `+${number}` : number);

export const useGetUserWallet = () => {
  const {user} = useSelector(state => state.session);
  const {customerInfo, customerWallet, promotionVoucher} = useSelector(state => state.toktokFood);

  const [getUserWallet, {data, error, refetch, loading}] = useLazyQuery(GET_MY_ACCOUNT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (customerInfo && user?.toktokWalletAccountId) {
      getUserWallet();
    }
  }, [customerInfo, getUserWallet, user]);

  return {
    data,
    error,
    refetch,
    loading,
    customerWallet,
    promotionVoucher,
  };
};
