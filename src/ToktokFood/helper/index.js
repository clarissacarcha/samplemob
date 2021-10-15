import {GeolocationUtility, reverseGeocode} from 'toktokfood/util';

export const getLocation = async () => {
  const currentLocation = await GeolocationUtility.getCurrentLocation();
  const {coords} = currentLocation;
  return coords;
};

export const getFormattedAddress = async (latitude, longitude) => {
  const result = await reverseGeocode({latitude, longitude});
  return result;
};
