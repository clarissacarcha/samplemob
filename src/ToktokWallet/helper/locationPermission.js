import RNLocation from 'react-native-location';
import {Alert, Linking} from 'react-native';

export const locationPermission = async ({showsReverseGeocode}) => {
  try {
    const granted = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    });

    // Return false is permission isn't granted
    if (!granted) {
      //CURRENT LOCATION: PERMISSION DENIED
      Alert.alert('', 'Location access needed. Go to settings, tap Location, and tap While Using the App.', [
        {
          text: 'DISMISS',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'GO TO SETTINGS', onPress: () => Linking.openSettings()},
      ]);
      return false;
    }

    // Fetch current location, destructure latitude and longitude
    const locRes = await RNLocation.getLatestLocation({
      timeout: 3000,
    });

    const {latitude, longitude, accuracy} = locRes;

    // const latitude = 14.818509430691329;
    // const longitude = 120.96382666665981;
    // const accuracy = 1;

    return {
      latitude,
      longitude,
      accuracy,
    };
  } catch (error) {
    console.log('location set error:', error);
  }
};
