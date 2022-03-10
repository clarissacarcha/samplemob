import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';

// Graphql
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from '../../graphql/client/graphql';
import {GET_SHOPS} from 'toktokfood/graphql/toktokfood';

// Helpers
import {getFormattedAddress, getLocation} from 'toktokfood/helper';
import {getUserLocation} from 'toktokfood/helper/PersistentLocation';

import {useSelector} from 'react-redux';

const checkContactNumber = (contact = '') => {
  if (contact !== '') {
    if (contact.slice(0, 2) === '63') {
      return contact.slice(2, contact.length);
    }
    return contact;
  }
  return '';
};

export const useUserLocation = () => {
  const {customerInfo} = useSelector(state => state.toktokFood);

  const dispatch = useDispatch();

  const initUserLocation = async () => {
    const saveLocation = await getUserLocation();
    if (saveLocation !== null && Object.keys(saveLocation).length === 2) {
      dispatch({type: 'SET_TOKTOKFOOD_LOCATION', payload: {...saveLocation.mapInfo}});
      dispatch({type: 'SET_TOKTOKFOOD_ORDER_RECEIVER', payload: {...saveLocation.details}});
    } else {
      // Get user initial location
      getLocation()
        .then(async res => {
          if (res) {
            // Do not spread address object from getFormattedAddress function and pass to payload
            // if the initial state structure of reducer is not equal to getFormattedAddress result.

            // getFormattedAddress example object result:
            // {"addressBreakdown": {"city": "", "country": "", "province": ""}, "formattedAddress": ""}
            // redux reducer structure for tokfood location: location: {address: "", latitude: 0, longitude: 0, }
            const {latitude, longitude} = res;
            const address = await getFormattedAddress(latitude, longitude);
            const payload = {
              latitude,
              longitude,
              address: address.formattedAddress,
            };
            dispatch({type: 'SET_TOKTOKFOOD_LOCATION', payload: {...payload}});
            const NAME =
              customerInfo.firstName && customerInfo.lastName
                ? `${customerInfo.firstName} ${customerInfo.lastName}`
                : '';
            dispatch({
              type: 'SET_TOKTOKFOOD_ORDER_RECEIVER',
              payload: {
                contactPerson: NAME,
                contactPersonNumber: customerInfo.conno ? checkContactNumber(customerInfo.conno) : '',
                landmark: '',
              },
            });
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    initUserLocation();
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
