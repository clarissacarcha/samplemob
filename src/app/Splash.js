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
import MaintenanceLogo from '../assets/images/MaintenanceLogo.png';
import MaintenanceImage from '../assets/images/MaintenanceImage.png';
import CONSTANTS from '../common/res/constants';
import LoginBanner from '../assets/images/ToktokLogo.png';

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

      setAppServices(appServicesResult.data.getAppServices);

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
      <ImageBackground
        style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}
        source={SplashImage}
        resizeMode={'cover'}>
        <View style={{alignItems: 'center', marginHorizontal: 20}}>
          <Image source={MaintenanceLogo} style={{width: 189, height: 183, marginTop: '50%'}} resizeMode="contain" />
          <Text
            style={{
              marginTop: 54,
              color: CONSTANTS.COLOR.ORANGE,
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              fontSize: CONSTANTS.FONT_SIZE.XL,
            }}>
            Tutok lang ka-toktok!
          </Text>
          <Text style={{textAlign: 'center', marginTop: 8, fontSize: CONSTANTS.FONT_SIZE.M, marginHorizontal: 50}}>
            We have added something new for you! Update now to continue enjoying the app.
          </Text>
          <TouchableHighlight
            style={{marginTop: 32, borderRadius: 10, alignSelf: 'center', marginHorizontal: 10}}
            onPress={() => Linking.openURL(deepLink)}
            underlayColor={COLOR}>
            <View
              style={{
                backgroundColor: '#F6841F',
                height: 40,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: CONSTANTS.COLOR.WHITE,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                  paddingHorizontal: '35%',
                  lineHeight: CONSTANTS.FONT_SIZE.L,
                }}>
                Update Now
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => setcheckPoint('A')} underlayColor={COLOR} style={{marginTop: 25}}>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.ORANGE}}>Skip</Text>
          </TouchableHighlight>
        </View>
        <Text style={{color: CONSTANTS.COLOR.ORANGE, marginBottom: 22, fontSize: CONSTANTS.FONT_SIZE.M}}>
          v{APP_VERSION}
        </Text>
      </ImageBackground>
    );
  }

  //New Version Required = BLOCK
  if (checkPoint == 'B') {
    return (
      <ImageBackground
        style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}
        source={SplashImage}
        resizeMode={'cover'}>
        <View style={{alignItems: 'center', marginHorizontal: 20}}>
          <Image source={MaintenanceLogo} style={{width: 189, height: 183, marginTop: '50%'}} resizeMode="contain" />
          <Text
            style={{
              marginTop: 54,
              color: CONSTANTS.COLOR.ORANGE,
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              fontSize: CONSTANTS.FONT_SIZE.XL,
            }}>
            Tutok lang ka-toktok!
          </Text>
          <Text style={{textAlign: 'center', marginTop: 8, fontSize: CONSTANTS.FONT_SIZE.M, marginHorizontal: 50}}>
            We have added something new for you! Update now to continue enjoying the app.
          </Text>
          <TouchableHighlight
            style={{marginTop: 32, borderRadius: 10, alignSelf: 'center', marginHorizontal: 10}}
            onPress={() => Linking.openURL(deepLink)}
            underlayColor={COLOR}>
            <View
              style={{
                backgroundColor: '#F6841F',
                height: 40,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: CONSTANTS.COLOR.WHITE,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                  paddingHorizontal: '35%',
                  lineHeight: CONSTANTS.FONT_SIZE.L,
                }}>
                Update Now
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <Text style={{color: CONSTANTS.COLOR.ORANGE, marginBottom: 22, fontSize: CONSTANTS.FONT_SIZE.M}}>
          v{APP_VERSION}
        </Text>
      </ImageBackground>
    );
  }

  // Maintenance/Server Issue
  if (checkPoint == 'MAINTENANCE') {
    return (
      <ImageBackground style={{flex: 1, alignItems: 'center'}} source={SplashImage} resizeMode={'cover'}>
        <Image
          source={LoginBanner}
          style={{height: imageWidth - 200, width: imageWidth - 150, marginTop: 120}}
          resizeMode="contain"
        />
        <Image source={MaintenanceImage} style={{height: imageWidth - 30, width: imageWidth - 70}} resizeMode="cover" />
        <Text
          style={{
            color: CONSTANTS.COLOR.ORANGE,
            fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
            fontSize: CONSTANTS.FONT_SIZE.XL,
          }}>
          Katok ka ulit mamaya!
        </Text>
        <Text style={{marginHorizontal: 20, textAlign: 'center', marginTop: 8}}>
          We are performing some maintenance to serve you better. We will be right back. Thank you.
        </Text>
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
