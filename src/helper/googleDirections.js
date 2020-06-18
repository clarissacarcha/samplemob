import {MAPS_API_KEY} from '../res/constants';
import axios from 'axios';

export const getDirections = async ({latitude, longitude}) => {
  try {
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_API_KEY}`;
    const url = `http://maps.googleapis.com/maps/api/directions/json?parameters`;

    const result = await axios.get(url);
    return {
      formattedAddress: result.data.results[0].formattedAddress
    }
  } catch (error) {
    console.log(error);
  }
};
