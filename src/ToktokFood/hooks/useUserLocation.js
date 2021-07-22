import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';

// Graphql
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql/client/graphql';
import {GET_CATEGORIES, GET_SHOPS} from 'toktokfood/graphql/toktokfood';

// Helpers
import {getFormattedAddress, getLocation} from 'toktokfood/helper';

export const useUserLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get user initial location
    getLocation().then(async (res) => {
      if (res) {
        const {latitude, longitude} = res;
        const address = await getFormattedAddress(latitude, longitude);
        const payload = {
          ...address,
          latitude,
          longitude,
        };
        dispatch({type: 'SET_TOKTOKFOOD_LOCATION', payload: {...payload}});
      }
    });
  }, []);
};

export const useCategories = () => {
  const dispatch = useDispatch();

  const [getCategories, {data, error, loading}] = useLazyQuery(GET_CATEGORIES, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getCategories}) => {
      if (getCategories.length > 0) {
        return dispatch({type: 'SET_TOKTOKFOOD_CATEGORIES', payload: {categories: getCategories}});
      }
      return null;
    },
  });
  useEffect(() => {
    getCategories();
  }, []);
};

export const useShops = () => {
  const dispatch = useDispatch();

  const [getShops, {data, error, loading}] = useLazyQuery(GET_SHOPS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getShops}) => {
      if (getShops.length > 0) {
        return dispatch({type: 'SET_TOKTOKFOOD_SHOPS', payload: {shops: getShops}});
      }
      return null;
    },
  });
  useEffect(() => {
    getShops();
  }, []);
};
