import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {MAPS_API_KEY} from 'res/constants';
import {PermissionUtility} from '../../util';

export class GeolocationUtility {
  // Get coordinates
  static getCurrentLocation = async () => {
    try {
      const {granted, message} = await PermissionUtility.getLocationPermission();

      console.log({granted, message});

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            console.log({error});
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 10000,
          },
        );
      });
    } catch (error) {}
  };

  // Get coordinates and formatted address
  static getCurrentAddress = () => {};
}

const mapAddressComponentsToObject = (addressComponents) => {
  const result = {};
  addressComponents.map((component) => {
    result[component.types[0]] = component.long_name;
  });

  const formattedResult = {
    city: result.locality,
    province: result.administrative_area_level_2,
    country: result.country,
  };

  return formattedResult;
};

export const reverseGeocode = async ({latitude, longitude}) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_API_KEY}`;

    const result = await axios.get(url);
    // console.log(JSON.stringify(result, null, 4));
    const addressBreakdown = mapAddressComponentsToObject(result.data.results[0].address_components);
    return {
      formattedAddress: result.data.results[0].formatted_address,
      addressBreakdown,
    };
  } catch (error) {
    console.log(error);
  }
};
