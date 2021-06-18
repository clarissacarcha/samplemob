import {GeolocationUtility} from 'toktokfood-util';

export const getLocation = async () => {
  const currentLocation = await GeolocationUtility.getCurrentLocation();
  const {coords} = currentLocation;
  return coords;
};
