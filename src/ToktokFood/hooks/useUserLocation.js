import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

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
        dispatch({type: 'SET_TOKTOKFOOD_LOCATION', payload: {...address, latitude, longitude}});
      }
    });
  });
};
