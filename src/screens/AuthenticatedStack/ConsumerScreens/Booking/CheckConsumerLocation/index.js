import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Dimensions, Text, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {MEDIUM} from '../../../../../res/constants';
import {SizedBox} from '../../../../../components/widgets';
import {BlackButton} from '../../../../../components/forms';
import {getCurrentLocation} from '../../../../../helper';

import LocationRequestImage from '../../../../../assets/images/LocationRequest.png';
const imageWidth = Dimensions.get('window').width - 40;

export default ({navigation, route}) => {
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const [hasProceed, setHasProceed] = useState(false);

  const onGrant = async () => {
    const {latitude, longitude, formattedAddress} = await getCurrentLocation({
      showsReverseGeocode: true,
    });
    console.log({hasProceed});
    if (!hasProceed) {
      console.log('RUNNING EVEN: ', hasProceed);
      navigation.replace('ConsumerMap', {
        detectedLocation: {
          latitude,
          longitude,
          formattedAddress,
        },
      });
    }
  };

  const onDeny = () => {
    setHasProceed(true);
    setTimeout(() => {
      navigation.replace('ConsumerMap', {
        detectedLocation: {
          latitude: null,
          longitude: null,
          formattedAddress: null,
        },
      });
    }, 200);
  };

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
    }

    // IF GPS Request Denied
    if (result === RESULTS.DENIED) {
      requestAndroid();
    }
  };

  const checkIOS = async () => {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

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
    }

    // IF GPS Request Denied
    if (result === RESULTS.DENIED) {
      requestIOS();
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

  const requestIOS = async () => {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (result === RESULTS.GRANTED) {
      onGrant();
    } else {
      onDeny();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const checkPermission = Platform.select({
        ios: checkIOS,
        android: checkAndroid,
      });

      checkPermission();

      setHasRequestedLocation(true);
    }, 600); //Set minimal timeout for screen to properly display before request dialog is shown
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Image source={LocationRequestImage} style={styles.image} />
        <Text style={styles.text}>Finding your location.</Text>
        <SizedBox />
        <Text style={styles.text}>Your location will be used as {'\n'} the default sender location.</Text>
        <SizedBox />

        <Text style={styles.text}>You may also proceed now and enter{'\n'}the sender location instead.</Text>
      </View>

      <BlackButton
        onPress={onDeny}
        label="Proceed"
        containerStyle={hasRequestedLocation ? styles.buttonVisible : styles.buttonHidden}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth,
    width: imageWidth,
    marginBottom: 20,
  },
  text: {
    fontFamily: 'Rubik-Medium',
    fontSize: 12,
    color: MEDIUM,
    textAlign: 'center',
  },
  buttonVisible: {
    margin: 20,
    opacity: 1,
  },
  buttonHidden: {
    margin: 20,
    opacity: 0,
  },
});
