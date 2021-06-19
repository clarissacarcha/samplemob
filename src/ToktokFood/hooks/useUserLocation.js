import {useRef, useEffect, useCallback} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {useDispatch} from 'react-redux';

// Helpers
import {getLocation} from 'toktokfood-helper';

export const useUserLocation = () => {
  const dispatch = useDispatch();

  //   const [getGoogleGeocodeReverse, {loading, error}] = useLazyQuery(GET_GOOGLE_GEOCODE_REVERSE, {
  //     fetchPolicy: 'network-only',
  //     onCompleted: ({getGoogleGeocodeReverse}) => {
  //       console.log(JSON.stringify({GEOCODED: getGoogleGeocodeReverse}, null, 4));

  //     },
  //     onError: (error) => console.log({error}),
  //   });

  useEffect(() => {
    // Get user initial location
    getLocation().then((res) => dispatch({type: 'SET_TOKTOKFOOD_LOCATION', payload: res}));
  });
};
