import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// SELF IMPORTS
import getLocationPermission from './getLocationPermission';

export class PermissionUtility {
  static getLocationPermission = getLocationPermission;
}
