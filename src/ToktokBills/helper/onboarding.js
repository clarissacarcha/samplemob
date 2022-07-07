import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveViewOnboarding = async toktokUserId => {
  try {
    const storedData = await getOnboardingData();

    storedData.push(toktokUserId);

    const parsedData = JSON.stringify(storedData);
    const res = await AsyncStorage.setItem('ONBOARDING', parsedData);
    return res;
  } catch (e) {
    // saving error
  }
};

export const checkViewOnboarding = async toktokUserId => {
  try {
    const data = await getOnboardingData();

    if (data.length > 0) {
      const result = data.find(item => item == toktokUserId);
      return result.length > 0;
    }
    return false;
  } catch (e) {
    // error reading value
  }
};

export const getOnboardingData = async () => {
  try {
    const data = await AsyncStorage.getItem('ONBOARDING');
    return data != null ? JSON.parse(data) : [];
  } catch (e) {
    // error reading value
  }
};

export const removeItemValue = async () => {
  try {
    await AsyncStorage.removeItem('ONBOARDING');
    return true;
  } catch (exception) {
    return false;
  }
};
