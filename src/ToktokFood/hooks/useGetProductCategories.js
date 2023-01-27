/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PRODUCT_CATEGORIES} from 'toktokfood/graphql/toktokfood';

export const useGetProductCategories = shopId => {
  const [routes, setRoutes] = useState([
    {
      key: 'allitems',
      title: 'All Menu',
    },
  ]);
  const [getProductCategories, {loading, refetch}] = useLazyQuery(GET_PRODUCT_CATEGORIES, {
    variables: {
      input: {
        id: shopId,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getProductCategories: categories}) => {
      setRoutes(categories);
    },
  });

  useEffect(() => {
    if (shopId) {
      getProductCategories();
    }
  }, [getProductCategories, shopId]);

  return {routes, loading, refetch};
};
