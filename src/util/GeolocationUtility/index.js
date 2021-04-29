import React, {useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {PermissionUtility} from '../../util';

export class GeolocationUtility {
  // Get coordinates
  static getCurrentLocation = async () => {
    try {
      const {granted, message} = await PermissionUtility.getLocationPermission();

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            console.log({error});
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 3600000,
          },
        );
      });
    } catch (error) {}
  };

  // Get coordinates and formatted address
  static getCurrentAddress = () => {};
}
