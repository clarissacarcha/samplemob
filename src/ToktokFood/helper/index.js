import {GeolocationUtility, reverseGeocode} from 'toktokfood/util';
import {MAPS_API_KEY} from 'res/constants';
import axios from 'axios';

export const getLocation = async () => {
  const currentLocation = await GeolocationUtility.getCurrentLocation();
  const {coords} = currentLocation;
  return coords;
};

export const getFormattedAddress = async (latitude, longitude) => {
  const result = await reverseGeocode({latitude, longitude});
  return result;
};
export const getDuration = async (origin, destination) => {
  try {
    const API_RESULT = await axios({
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=fastest&departure_time=now&key=${MAPS_API_KEY}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const res = API_RESULT.data.routes[0]?.legs[0]?.duration_in_traffic.value;
    return res
  } catch (error) {
    console.log(origin, destination, 'MAAAPP')
    console.log(error);
  }
};