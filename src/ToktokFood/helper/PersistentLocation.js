import AsyncStorage from '@react-native-community/async-storage';

export const SaveUserLocation = async (obj = {}) => {
  try {
    if (Object.keys(obj).length > 0) {
      await AsyncStorage.setItem('CART_LOCATION', JSON.stringify(obj));
    }
  } catch (err) {
    console.log('Error saving location.');
    throw err;
  }
};

export const GetUserLocation = async () => {
  try {
    const location = await AsyncStorage.getItem('CART_LOCATION');
    if (typeof location === 'string') {
      return JSON.parse(location);
    } else {
      return null;
    }
  } catch (err) {
    console.log('Error retrieving location.');
  }
};
