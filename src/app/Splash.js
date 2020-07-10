import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  TouchableHighlight,
  Platform,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import OneSignal from 'react-native-onesignal';
import {APP_FLAVOR, APP_VERSION, MEDIUM, COLOR, DARK} from '../res/constants';
import {AUTH_CLIENT, GET_APP_VERSION_STATUS, GET_GLOBAL_SETTINGS} from '../graphql';

import Nav from './Nav';
import SplashImage from '../assets/images/Splash.png';
import Maintenance from '../assets/images/Maintenance.png';

const imageWidth = Dimensions.get('window').width - 80;

const mapKeyValueToObject = keyValueArray => {
  const result = {};
  keyValueArray.map(kv => {
    result[kv.settingKey] = kv.keyValue;
  });

  return result;
};

const Splash = ({setConstants}) => {
  const [checkPoint, setcheckPoint] = useState(''); // A-Allow, S-Suggest, B-Block, M-Maintenance
  const [deepLink, setDeepLink] = useState('');

  const oneSignalInit = async oneSignalAppId => {
    OneSignal.init(oneSignalAppId);
    OneSignal.inFocusDisplaying(0);
  };

  const fetchInitialData = async () => {
    try {
      /**
       * Fetch Global Settings
       */
      const globalSettingRecords = await AUTH_CLIENT.query({
        query: GET_GLOBAL_SETTINGS,
        fetchPolicy: 'network-only',
      });

      const constantsObject = mapKeyValueToObject(globalSettingRecords.data.getGlobalSettings);
      setConstants(constantsObject);

      const {appStoreDeepLink, playStoreDeepLink} = constantsObject;

      const deepLinkUrl = Platform.select({
        ios: appStoreDeepLink,
        android: playStoreDeepLink,
      });

      setDeepLink(deepLinkUrl);

      // Set OneSignalAppId for Consumer
      if (APP_FLAVOR == 'C') {
        oneSignalInit(constantsObject.consumerOneSignalAppId);
      }

      // Set OneSignalAppId for Driver
      if (APP_FLAVOR == 'D') {
        oneSignalInit(constantsObject.driverOneSignalAppId);
      }

      /**
       * Check App Version Status
       */
      const result = await AUTH_CLIENT.query({
        query: GET_APP_VERSION_STATUS,
        fetchPolicy: 'network-only',
        variables: {
          filter: {
            appFlavor: APP_FLAVOR,
            version: APP_VERSION,
            platform: Platform.select({ios: 'I', android: 'A'}),
          },
        },
      });

      const {isCurrent, enabled} = result.data.getAppVersionStatus;

      if (isCurrent && enabled) {
        setcheckPoint('A');
      }

      if (!isCurrent && enabled) {
        setcheckPoint('S');
      }

      if (!isCurrent && !enabled) {
        setcheckPoint('B');
      }
    } catch (error) {
      console.log(error);
      setcheckPoint('M');
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  if (checkPoint == 'A') {
    return <Nav />;
  }

  if (checkPoint == 'S') {
    return (
      <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'}>
        <View style={styles.imageBox}>
          <Image source={Maintenance} style={styles.image} />
          <Text style={styles.text}>We have added something new for you.</Text>
          <TouchableHighlight onPress={() => Linking.openURL(deepLink)} underlayColor={COLOR} style={styles.submitBox}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 20}}>Update Now</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => setcheckPoint('A')} underlayColor={COLOR} style={styles.submitBox}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 20}}>Update Later</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    );
  }

  if (checkPoint == 'B') {
    return (
      <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'}>
        <View style={styles.imageBox}>
          <Image source={Maintenance} style={styles.image} />
          <Text style={styles.text}>We have added something new for you.</Text>
          <TouchableHighlight onPress={() => Linking.openURL(deepLink)} underlayColor={COLOR} style={styles.submitBox}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 20}}>Update Now</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    );
  }

  if (checkPoint == 'M') {
    return (
      <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'}>
        <View style={styles.imageBox}>
          <Image source={Maintenance} style={styles.image} />
          <Text style={styles.text}>We're adding new features. Come back again later.</Text>
        </View>
      </ImageBackground>
    );
  }

  return <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'} />;
};

const mapDispatchToProps = dispatch => ({
  setConstants: payload => dispatch({type: 'SET_CONSTANTS', payload}),
});

export default connect(
  null,
  mapDispatchToProps,
)(Splash);

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth,
    width: imageWidth,
  },
  imageBox: {
    borderRadius: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: MEDIUM,
  },
  submitBox: {
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
