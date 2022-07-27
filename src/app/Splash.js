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
  SafeAreaView,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import OneSignal from 'react-native-onesignal';
import {APP_FLAVOR, APP_VERSION, MEDIUM, COLOR, DARK} from '../res/constants';
import {AUTH_CLIENT, GET_APP_VERSION_STATUS, GET_GLOBAL_SETTINGS, GET_APP_SERVICES} from '../graphql';

import Nav from './Nav';
import SplashImage from '../assets/images/LinearGradiant.png';
import Maintenance from '../assets/images/Maintenance.png';
import NoNetworkConnection from '../assets/images/NoNetworkConnection.png';
import ToktokSuperApp from '../assets/images/ToktokLogo.png';
import ServerDown from '../assets/images/ServerDown.png';

const imageWidth = Dimensions.get('window').width - 80;

const mapKeyValueToObject = keyValueArray => {
  const result = {};
  keyValueArray.map(kv => {
    result[kv.settingKey] = kv.keyValue;
  });

  return result;
};

const Splash = ({setConstants, setAppServices}) => {
  const [checkPoint, setcheckPoint] = useState(''); // A-Allow, S-Suggest, B-Block, M-Maintenance
  const [deepLink, setDeepLink] = useState('');

  const oneSignalInit = async oneSignalAppId => {
    console.log('Setting OneSignal APP ID ', oneSignalAppId);

    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse(allowed => {
        if (allowed) {
          OneSignal.setAppId(oneSignalAppId);
        }
      });
    } else {
      OneSignal.setAppId(oneSignalAppId);
    }
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

      const {appStoreDeepLink, playStoreDeepLink, playStoreRiderDeepLink} = constantsObject;

      let deepLinkUrl = '';

      if (APP_FLAVOR === 'C') {
        deepLinkUrl = Platform.select({
          ios: appStoreDeepLink,
          android: playStoreDeepLink,
        });
      }

      if (APP_FLAVOR === 'D') {
        deepLinkUrl = playStoreRiderDeepLink;
      }

      setDeepLink(deepLinkUrl);

      // Set OneSignalAppId for Consumer
      if (APP_FLAVOR === 'C') {
        oneSignalInit(constantsObject.consumerOneSignalAppId);
      }

      // Set OneSignalAppId for Driver
      if (APP_FLAVOR === 'D') {
        oneSignalInit(constantsObject.driverOneSignalAppId);
      }

      const appServicesResult = await AUTH_CLIENT.query({
        query: GET_APP_SERVICES,
        fetchPolicy: 'network-only',
      });

      // setAppServices(appServicesResult.data.getAppServices);

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
      console.log(result.data.getAppVersionStatus)

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
      setcheckPoint('MAINTENANCE');
      console.log(JSON.stringify(error));
    }
  };

  const checkNetworkConnection = async () => {
    const netResult = await NetInfo.fetch();

    if (!netResult.isConnected) {
      setcheckPoint('NO_NETWORK_CONNECTION');
      return;
    }

    fetchInitialData();
  };

  useEffect(() => {
    checkNetworkConnection();
  }, []);

  // Updated Version = ALLOW
  if (checkPoint === 'A') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Nav />
      </SafeAreaView>
    );
  }

  if (checkPoint === 'NO_NETWORK_CONNECTION') {
    return (
      <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'}>
        <View style={styles.imageBox}>
          <Image source={NoNetworkConnection} style={styles.image} resizeMode="contain" />
          <Text style={styles.text}>{'Hey ka-toktok, please check\nyour internet connection'}.</Text>
        </View>
      </ImageBackground>
    );
  }

  // New Version Optional = SUGGEST
  if (checkPoint === 'S') {
    return (
      <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'}>
        <View style={styles.imageBox}>
          <Image source={Maintenance} style={styles.image} resizeMode="contain" />
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

  //New Version Required = BLOCK
  if (checkPoint == 'B') {
    return (
      <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'}>
        <View style={styles.imageBox}>
          <Image source={Maintenance} style={styles.image} resizeMode="contain" />
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

  // Maintenance/Server Issue
  if (checkPoint == 'MAINTENANCE') {
    return (
      <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'}>
        <View style={styles.imageBox}>
          <Image source={ServerDown} style={styles.image} resizeMode="contain" />
          <Text style={styles.text}>Cannot connect to server. Come back again later.</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'}>
      <Image source={ToktokSuperApp} style={styles.image} resizeMode="contain" />
    </ImageBackground>
  );
};

const mapDispatchToProps = dispatch => ({
  setConstants: payload => dispatch({type: 'SET_CONSTANTS', payload}),
  setAppServices: payload => dispatch({type: 'SET_APP_SERVICES', payload}),
});

export default connect(null, mapDispatchToProps)(Splash);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth - 70,
    width: imageWidth - 150,
    alignSelf: 'center',
  },
  imageBox: {
    borderRadius: 10,
    padding: 20,
    paddingBottom: 0,
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
    fontFamily: 'Rubik-Medium',
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
