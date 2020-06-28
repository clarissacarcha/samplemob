import RNLocation from 'react-native-location';
import {reverseGeocode} from './googleGeocode';

export const currentLocation = async ({showsReverseGeocode}) => {
  try {
    const granted = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    });

    // Return false is permission isn't granted
    if (!granted) {
      console.log('CURRENT LOCATION: PERMISSION DENIED');
      return false;
    }

    // Fetch current location, destructure latitude and longitude
    const {latitude, longitude, accuracy} = await RNLocation.getLatestLocation({
      timeout: 2000,
    });

    // If not asking for reverseGeocode, return an object with latitude and longitude
    if (!showsReverseGeocode) {
      return {
        latitude,
        longitude,
        accuracy,
      };
    }

    const result = await reverseGeocode({latitude, longitude});

    const {addressBreakdown, formattedAddress} = result;
    return {
      latitude,
      longitude,
      accuracy,
      formattedAddress: formattedAddress,
      address: addressBreakdown,
    };
  } catch (error) {
    console.log(error);
  }
};
