import AsyncStorage from '@react-native-community/async-storage';

export const saveNewShopHistory = async (obj = []) => {
  try {
    if (obj.length > 0) {
      await AsyncStorage.setItem('SEARCH_HISTORY', JSON.stringify(obj));
    }
  } catch (err) {
    console.log('Error saving history.');
    throw err;
  }
};

export const getShopHistory = async () => {
  try {
    const history = await AsyncStorage.getItem('SEARCH_HISTORY');
    if (typeof history === 'string') {
      return JSON.parse(history);
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error retrieving history list.');
    throw err;
  }
};

export const clearShopHistory = async () => {
  try {
    await AsyncStorage.removeItem('SEARCH_HISTORY');
  } catch (err) {
    console.log('Error retrieving history list.');
    throw err;
  }
};
