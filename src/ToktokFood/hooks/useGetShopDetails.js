/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SHOP_DETAILS} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';

export const useGetShopDetails = shopId => {
  const {location} = useSelector(s => s.toktokFood);

  const [getShopDetails, {data}] = useLazyQuery(GET_SHOP_DETAILS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onError: err => console.log('getShopDetails', JSON.stringify(err)),
  });

  useEffect(() => {
    if (shopId) {
      getShopDetails({
        variables: {
          input: {
            shopId: shopId?.toString(),
            userLongitude: location?.longitude,
            userLatitude: location?.latitude,
          },
        },
      });
    }
  }, [getShopDetails, location, shopId]);

  return {shopDetails: data};
};
