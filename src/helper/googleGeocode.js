import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import ENVIRONMENTS from '../common/res/environments';

export const reverseGeocode = async ({latitude, longitude}) => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const authorizationHeader = `Bearer ${accessToken}`;

    const apiResult = await axios({
      url: `${ENVIRONMENTS.TOKTOK_SERVER}/graphql`,
      method: 'post',
      headers: {
        Authorization: authorizationHeader,
      },
      data: {
        query: `
          query getGoogleGeocodeReverse {
            getGoogleGeocodeReverse(
              input: { coordinates: { 
                latitude: ${latitude},
                longitude: ${longitude}
              } }
            ) {
              formattedAddress
              addressBreakdown {
                city
                province
                region
                country
                postal
              }
              addressBreakdownHash
            }
          }
              `,
      },
    });

    if (apiResult.data.data.getGoogleGeocodeReverse) {
      return {
        formattedAddress: apiResult.data.data.getGoogleGeocodeReverse.formattedAddress,
        addressBreakdown: apiResult.data.data.getGoogleGeocodeReverse.addressBreakdown,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
