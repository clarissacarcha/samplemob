import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const getLocationPermission = async () => {
  // Get function to check permission for the platform.
  const checkLocationPermission = Platform.select({
    android: () => check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
    ios: () => check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE),
  });

  //  Get function to request permission for the platform.
  const requestLocationPermission = Platform.select({
    android: () => request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
    ios: () => request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE),
  });

  // Get location permission.
  const locationPermissionResult = await checkLocationPermission();

  // Location request is granted.
  if (locationPermissionResult === RESULTS.GRANTED) {
    return {
      granted: true,
      message: 'Location request granted.',
    };
  }

  // Location service is unavailable in the device.
  if (locationPermissionResult === RESULTS.UNAVAILABLE) {
    return {
      granted: false,
      message: 'Sorry, location service is unavailable in your device.',
    };
  }

  // Location service request was blocked. Check device settings.
  if (locationPermissionResult === RESULTS.BLOCKED) {
    return {
      granted: false,
      message: "Sorry, location service request was blocked. Please allow location service in your phone's settings.",
    };
  }

  // Location service request was denied. Request location service permission
  if (locationPermissionResult === RESULTS.DENIED) {
    const locationRequestResult = await requestLocationPermission();

    if (locationRequestResult === RESULTS.GRANTED) {
      return {
        granted: true,
        message: 'Location request granted.',
      };
    }

    if (locationRequestResult !== RESULTS.GRANTED) {
      return {
        granted: false,
        message: 'Sorry, location service request was denied.',
      };
    }
  }
};

export default getLocationPermission;
