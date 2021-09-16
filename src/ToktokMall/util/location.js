import Geolocation from 'react-native-geolocation-service';
import {MAPS_API_KEY} from 'res/constants';
import {PermissionUtility} from '../../util';
import axios from 'axios';

export class GeolocationUtility {
    // Get coordinates
  static getCurrentLocation = async () => {
    try {
      const {granted, message} = await PermissionUtility.getLocationPermission();
  
      console.log({granted, message});
  
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
            maximumAge: 10000,
          },
        );
      });
    } catch (error) {}
  };
  
  // Get coordinates and formatted address
  static getCurrentAddress = () => {};

  static getCoordinatesFromAddress = async (address) => {

    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(address)}&inputtype=textquery&fields=formatted_address%2Cname%2Cgeometry&key=${MAPS_API_KEY}`,
      headers: { }
    };
    
    axios(config)
    .then( (response) => {
      if(response.data.status == "OK"){
        if(response.data.candidates.length > 0){
          let data = response.data.candidates[0]
          return data.geometry.location
        }else{
          return null
        }
      }
    })
    .catch( (error) => {
      console.log(error);
    });

  }

}