/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SHOPS_W_PROMOTIONS} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';

const removeSpecialCharacters = text => text.replace(/[^a-z0-9 ]/gi, '');
const formatMobileNumber = number => (number.charAt(0) === '6' ? `+${number}` : number);

export const useGetShopsPromotions = () => {
  const {location} = useSelector(s => s.toktokFood);
  const [state, setState] = useState([]);

  const [getShopsPromotions, {loading, refetch}] = useLazyQuery(GET_SHOPS_W_PROMOTIONS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({getPromoSections}) => {
      setState(getPromoSections);
    },
  });

  useEffect(() => {
    if (location) {
      getShopsPromotions({
        variables: {
          input: {
            radius: 3,
            userLongitude: location?.longitude,
            userLatitude: location?.latitude,
          },
        },
      });
    }
  }, [getShopsPromotions, location]);

  return {
    shopPromotions: state,
    shopPromotionLoading: loading,
    shopPromotionRefetch: refetch,
  };
};
