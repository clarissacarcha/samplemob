import {MAPS_API_KEY} from '../res/constants';
import axios from 'axios';

export const reverseGeocode = async ({latitude, longitude}) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_API_KEY}`;

    const result = await axios.get(url);
    return {
      formattedAddress: result.data.results[0].formatted_address
    }
  } catch (error) {
    console.log(error);
  }
};

const sampleResponse = {
  plus_code: {
    compound_code: 'R2M5+67 Santa Maria, Bulacan, Philippines',
    global_code: '7Q63R2M5+67',
  },
  results: [
    {
      address_components: [
        {
          long_name: 'Santa Maria-San Jose Road',
          short_name: 'Santa Maria-San Jose Rd',
          types: ['route'],
        },
        {
          long_name: 'Santa Maria',
          short_name: 'Santa Maria',
          types: ['locality', 'political'],
        },
        {
          long_name: 'Bulacan',
          short_name: 'Bulacan',
          types: ['administrative_area_level_2', 'political'],
        },
        {
          long_name: 'Central Luzon',
          short_name: 'Central Luzon',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: 'Philippines',
          short_name: 'PH',
          types: ['country', 'political'],
        },
      ],
      formatted_address:
        'Santa Maria-San Jose Rd, Santa Maria, Bulacan, Philippines',
      geometry: {
        bounds: {
          northeast: {
            lat: 14.8327552,
            lng: 121.0089243,
          },
          southwest: {
            lat: 14.832465,
            lng: 121.0086763,
          },
        },
        location: {
          lat: 14.8326101,
          lng: 121.0088003,
        },
        location_type: 'GEOMETRIC_CENTER',
        viewport: {
          northeast: {
            lat: 14.8339590802915,
            lng: 121.0101492802915,
          },
          southwest: {
            lat: 14.8312611197085,
            lng: 121.0074513197085,
          },
        },
      },
      place_id: 'ChIJY3xOF5WulzMR-mVDkj2rYiA',
      types: ['route'],
    },
    {
      address_components: [
        {
          long_name: 'Bulac',
          short_name: 'Bulac',
          types: ['administrative_area_level_5', 'political'],
        },
        {
          long_name: 'Santa Maria',
          short_name: 'Santa Maria',
          types: ['locality', 'political'],
        },
        {
          long_name: 'Bulacan',
          short_name: 'Bulacan',
          types: ['administrative_area_level_2', 'political'],
        },
        {
          long_name: 'Central Luzon',
          short_name: 'Central Luzon',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: 'Philippines',
          short_name: 'PH',
          types: ['country', 'political'],
        },
      ],
      formatted_address: 'Bulac, Santa Maria, Bulacan, Philippines',
      geometry: {
        bounds: {
          northeast: {
            lat: 14.851527,
            lng: 121.0312149,
          },
          southwest: {
            lat: 14.8179009,
            lng: 121.0053059,
          },
        },
        location: {
          lat: 14.8385623,
          lng: 121.0163079,
        },
        location_type: 'APPROXIMATE',
        viewport: {
          northeast: {
            lat: 14.851527,
            lng: 121.0312149,
          },
          southwest: {
            lat: 14.8179009,
            lng: 121.0053059,
          },
        },
      },
      place_id: 'ChIJaTl_RMKulzMRwOSUJ7nsLR4',
      types: ['administrative_area_level_5', 'political'],
    },
    {
      address_components: [
        {
          long_name: 'Santa Maria',
          short_name: 'Santa Maria',
          types: ['locality', 'political'],
        },
        {
          long_name: 'Bulacan',
          short_name: 'Bulacan',
          types: ['administrative_area_level_2', 'political'],
        },
        {
          long_name: 'Central Luzon',
          short_name: 'Central Luzon',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: 'Philippines',
          short_name: 'PH',
          types: ['country', 'political'],
        },
      ],
      formattedAddress: 'Santa Maria, Bulacan, Philippines',
      geometry: {
        bounds: {
          northeast: {
            lat: 14.8972663,
            lng: 121.0310984,
          },
          southwest: {
            lat: 14.7853601,
            lng: 120.942627,
          },
        },
        location: {
          lat: 14.847608,
          lng: 120.9808582,
        },
        location_type: 'APPROXIMATE',
        viewport: {
          northeast: {
            lat: 14.8972663,
            lng: 121.0310984,
          },
          southwest: {
            lat: 14.7853601,
            lng: 120.942627,
          },
        },
      },
      place_id: 'ChIJX6UnrCKslzMR0A1cPGQRhko',
      types: ['locality', 'political'],
    },
    {
      address_components: [
        {
          long_name: 'Santa Maria',
          short_name: 'Santa Maria',
          types: ['administrative_area_level_3', 'political'],
        },
        {
          long_name: 'Bulacan',
          short_name: 'Bulacan',
          types: ['administrative_area_level_2', 'political'],
        },
        {
          long_name: 'Central Luzon',
          short_name: 'Central Luzon',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: 'Philippines',
          short_name: 'PH',
          types: ['country', 'political'],
        },
      ],
      formattedAddress: 'Santa Maria, Bulacan, Philippines',
      geometry: {
        bounds: {
          northeast: {
            lat: 14.897812,
            lng: 121.0312149,
          },
          southwest: {
            lat: 14.785132,
            lng: 120.9207699,
          },
        },
        location: {
          lat: 14.8289779,
          lng: 120.9761599,
        },
        location_type: 'APPROXIMATE',
        viewport: {
          northeast: {
            lat: 14.897812,
            lng: 121.0312149,
          },
          southwest: {
            lat: 14.785132,
            lng: 120.9207699,
          },
        },
      },
      place_id: 'ChIJVVaqhxeslzMRp3o9tL21wjw',
      types: ['administrative_area_level_3', 'political'],
    },
    {
      address_components: [
        {
          long_name: 'Bulacan',
          short_name: 'Bulacan',
          types: ['administrative_area_level_2', 'political'],
        },
        {
          long_name: 'Central Luzon',
          short_name: 'Central Luzon',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: 'Philippines',
          short_name: 'PH',
          types: ['country', 'political'],
        },
      ],
      formattedAddress: 'Bulacan, Philippines',
      geometry: {
        bounds: {
          northeast: {
            lat: 15.2733859,
            lng: 121.345656,
          },
          southwest: {
            lat: 14.688468,
            lng: 120.6633681,
          },
        },
        location: {
          lat: 14.9967842,
          lng: 121.1710389,
        },
        location_type: 'APPROXIMATE',
        viewport: {
          northeast: {
            lat: 15.2733859,
            lng: 121.345656,
          },
          southwest: {
            lat: 14.688468,
            lng: 120.6633681,
          },
        },
      },
      place_id: 'ChIJa0ro3RkHlzMRGV8Iw9c_mcM',
      types: ['administrative_area_level_2', 'political'],
    },
    {
      address_components: [
        {
          long_name: 'Central Luzon',
          short_name: 'Central Luzon',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: 'Philippines',
          short_name: 'PH',
          types: ['country', 'political'],
        },
      ],
      formattedAddress: 'Central Luzon, Philippines',
      geometry: {
        bounds: {
          northeast: {
            lat: 16.535904,
            lng: 122.282254,
          },
          southwest: {
            lat: 14.374842,
            lng: 117.7114671,
          },
        },
        location: {
          lat: 15.4827722,
          lng: 120.7120023,
        },
        location_type: 'APPROXIMATE',
        viewport: {
          northeast: {
            lat: 16.535904,
            lng: 122.282254,
          },
          southwest: {
            lat: 14.374842,
            lng: 117.7114671,
          },
        },
      },
      place_id: 'ChIJ4UqGC8MvlzMRNAh-R31d2qw',
      types: ['administrative_area_level_1', 'political'],
    },
    {
      address_components: [
        {
          long_name: 'Philippines',
          short_name: 'PH',
          types: ['country', 'political'],
        },
      ],
      formattedAddress: 'Philippines',
      geometry: {
        bounds: {
          northeast: {
            lat: 21.2412572,
            lng: 127.6444784,
          },
          southwest: {
            lat: 4.2259,
            lng: 116.1474999,
          },
        },
        location: {
          lat: 12.879721,
          lng: 121.774017,
        },
        location_type: 'APPROXIMATE',
        viewport: {
          northeast: {
            lat: 21.2412572,
            lng: 127.6444784,
          },
          southwest: {
            lat: 4.2259,
            lng: 116.1474999,
          },
        },
      },
      place_id: 'ChIJY96HXyFTQDIRV9opeu-QR3g',
      types: ['country', 'political'],
    },
  ],
  status: 'OK',
};
