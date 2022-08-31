/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {useFocusEffect} from '@react-navigation/native';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTIONS} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';

export const useGetActivities = orderStatus => {
  const {customerInfo} = useSelector(s => s.toktokFood);

  const [getOrders, {data, error, refetch, loading, fetchMore}] = useLazyQuery(GET_ORDER_TRANSACTIONS, {
    variables: {
      input: {
        userId: `${customerInfo.userId}`,
        orderStatus,
        page: 0,
        limit: 10,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (customerInfo && customerInfo?.userId) {
      getOrders();
    }
  }, [customerInfo, getOrders]);

  return {data, refetch, loading, fetchMore, error};
};
