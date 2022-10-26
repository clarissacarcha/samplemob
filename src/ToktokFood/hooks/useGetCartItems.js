/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ALL_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';

const removeSpecialCharacters = text => text?.replace(/[^a-z0-9 ]/gi, '');
const formatMobileNumber = number => (number.charAt(0) === '6' ? `+${number}` : number);

export const useGetCartItems = () => {
  const {customerInfo, location, receiver} = useSelector(s => s.toktokFood);

  const DELIVERY_RECEIVER = receiver?.contactPerson ?? `${customerInfo.firstName} ${customerInfo.lastName}`;
  const RECEIVER_CONTACT_NUMBER = receiver?.contactPersonNumber ?? customerInfo.conno;
  const RECEIVER_ADDRESS = location?.address;
  const RECEIVER_LANDMARK = receiver?.landmark;

  const [getCartItems, {data, error, refetch, loading}] = useLazyQuery(GET_ALL_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onError: err => console.log('getCartItems', JSON.stringify(err)),
  });

  useEffect(() => {
    if (customerInfo && customerInfo?.userId) {
      getCartItems({
        variables: {
          input: {
            userId: customerInfo.userId,
          },
        },
      });
    }
  }, [customerInfo, getCartItems]);

  return {
    cartData: data?.getAllTemporaryCart,
    cartRefetch: refetch,
    cartLoading: loading,
    cartError: error,
    deliveryReceiver: removeSpecialCharacters(DELIVERY_RECEIVER),
    receiverContact: formatMobileNumber(RECEIVER_CONTACT_NUMBER),
    receiverAddress: removeSpecialCharacters(RECEIVER_ADDRESS),
    receiverLandmark: removeSpecialCharacters(RECEIVER_LANDMARK),
  };
};
