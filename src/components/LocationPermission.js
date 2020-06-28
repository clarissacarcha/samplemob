/**
 * Component used to check location permission
 */

import React, {useState, useEffect} from 'react';
import {View, Alert, StyleSheet, Image, Dimensions, Text, TouchableHighlight} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {COLOR, COLOR_UNDERLAY, MEDIUM, DARK} from '../res/constants';

import LocationRequest from '../assets/images/LocationRequest.png';
const imageWidth = Dimensions.get('window').width - 40;

export const LocationPermission = ({onGrant, onDeny}) => {
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  const checkAndroid = async () => {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    // Location Unavailable In Device. Proceed and use INITIAL_REGION as region
    if (result === RESULTS.UNAVAILABLE) {
      onDeny();
    }

    // Location Request Denied. Proceed and use INITIAL_REGION as region
    if (result === RESULTS.BLOCKED) {
      onDeny();
    }

    // IF GPS Request Granted
    if (result === RESULTS.GRANTED) {
      onGrant();
      console.log('GRANTED ON RESULT');
    }

    // IF GPS Request Denied
    if (result === RESULTS.DENIED) {
      requestAndroid();
    }
  };

  const requestAndroid = async () => {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (result === RESULTS.GRANTED) {
      onGrant();
    } else {
      onDeny();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      checkAndroid();
      setHasRequestedLocation(true);
    }, 600); //Set minimal timeout for screen to properly display before request dialog is shown
  }, []);

  return (
    <View style={styles.absolute}>
      <View style={{marginBottom: 50}}>
        <Image source={LocationRequest} style={{height: imageWidth, width: imageWidth, marginBottom: 20}} />
        <Text style={{fontWeight: 'bold', fontSize: 12, color: MEDIUM, textAlign: 'center', marginBottom: 20}}>
          Finding your location.
        </Text>
        <Text style={{fontWeight: 'bold', fontSize: 12, color: MEDIUM, textAlign: 'center', marginBottom: 20}}>
          Your location will be used as {'\n'} the default sender location.
        </Text>
        <Text style={{fontWeight: 'bold', fontSize: 12, color: MEDIUM, textAlign: 'center'}}>
          You may also proceed now and enter{'\n'}the sender location instead.
        </Text>
      </View>

      {hasRequestedLocation && (
        <TouchableHighlight onPress={onDeny} underlayColor={COLOR} style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>Proceed</Text>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
