import React, {useState, useEffect, useCallback} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, SafeAreaView, StatusBar, ScrollView, RefreshControl, Platform} from 'react-native';
import OneSignal from 'react-native-onesignal';
import FlagSecure from 'react-native-flag-secure-android';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {COLOR} from '../../../../../res/variables';

//SELF IMPORTS
import {Header, HeaderSearchField, Menu, Advertisements} from './Components';
import {GET_USER_HASH} from '../../../../../graphql';
import {onError} from '../../../../../util/ErrorUtility';
import {useLazyQuery} from '@apollo/react-hooks';

const Screen = ({navigation, constants, session, createSession}) => {
  // const userLocation = {
  //   latitude,
  //   longitude,
  //   formattedAddress,
  //   formattedAddressHash
  // }
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS == 'android') FlagSecure.deactivate();
    }, []),
  );

  const [userLocation, setUserLocation] = useState(null);

  const onNotificationOpened = ({notification}) => {
    try {

      console.log("Notification", JSON.stringify(notification))

      if (notification.additionalData.classification === 'toktokwallet') {
        setTimeout(() => {
          // navigation.navigate('ToktokWalletHomePage');
          // navigation.replace('ToktokWalletHomePage');
        }, 10);
        return;
      }else if (notification.additionalData.classification === 'toktokmall') {
        setTimeout(() => {
          navigation.navigate('ToktokMallSplashScreen');
        }, 10);
        return;
      }

      if (notification.additionalData.classification === 'toktokbills') {
        setTimeout(() => {
          navigation.navigate('ToktokBillsNotifications');
        }, 10);
        return;
      }

      if (notification.additionalData.classification === 'toktokload') {
        setTimeout(() => {
          navigation.navigate('ToktokLandingNotifications', {screen: 'ToktokLoadNotifications'});
        }, 10);
        return;
      }
      const type = notification.additionalData.type;

      if (type) {
        if (type == 'ANNOUNCEMENT') {
          setTimeout(() => {
            navigation.push('Announcements');
          }, 10);
          return;
        }

        setTimeout(() => {
          navigation.push('Notifications');
        }, 10);
      }
    } catch (error) {
      console.warn('Notification no additional data.');
    }
  };

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(onNotificationOpened);
    getUserHash();
    // const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
    //   return true;
    // });
    return () => {
      // backHandler.remove();
    };
  }, []);

  const [getUserHash] = useLazyQuery(GET_USER_HASH, {
    fetchPolicy: 'network-only',
    onError,
    onCompleted: response => {
      const newSession = {...session};
      newSession.userHash = response.getUserHash;
      createSession(newSession);
    },
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent />
      <View style={styles.screen}>
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[COLOR.YELLOW]}
              refreshing={false}
              onRefresh={() => {
                console.log('REFRESHED');
              }}
            />
          }
        > */}
        {/* <Header /> */}
        {/* <Menu setUserLocation={setUserLocation} constants={constants} /> */}
        <Advertisements
          Header={Header}
          HeaderSearchField={HeaderSearchField}
          Menu={Menu}
          setUserLocation={setUserLocation}
          constants={constants}
        />
        {/* </ScrollView> */}
      </View>
    </>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokLandingHome = connect(mapStateToProps, mapDispatchToProps)(Screen);

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
  },
});
