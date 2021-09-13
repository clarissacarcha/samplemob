import AsyncStorage from '@react-native-community/async-storage';
export const storeTemporaryCart = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('store_temporary_cart', jsonValue)

    return { status: 200, message: 'success' }
  } catch (e) {
    return { status: 500, message: 'failed' }
  }
}
export const getTemporaryCart = async () => {
  try {
    const storeData = await AsyncStorage.getItem('store_temporary_cart')
    if(storeData != null){
      return JSON.parse(storeData);
    }
    return { cart: [], totalAmount: 0 }
  } catch (e) {
    return { cart: [], totalAmount: 0 }
  }
}
export const clearTemporaryCart = async(key) => {
  try {
    await AsyncStorage.removeItem('store_temporary_cart');
    return true;
  } catch(exception) {
    return false;
  }
}
