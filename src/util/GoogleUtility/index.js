import {MAPS_API_KEY} from '../../res/constants';
import {AxiosUtility} from '../../util';

export class GoogleUtility {
  static placeNearbySearch = async ({latitude, longitude, radius, type}) => {
    return await AxiosUtility.get({
      url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      params: {
        location: `${latitude},${longitude}`,
        radius,
        type,
        key: MAPS_API_KEY,
        opennow: true,
      },
    });
  };
}
