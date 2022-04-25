import React, {useState, useEffect,useCallback} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, SafeAreaView, StatusBar, ScrollView, RefreshControl , Platform} from 'react-native';
import OneSignal from 'react-native-onesignal';
import FlagSecure from 'react-native-flag-secure-android';
import { useNavigation , useFocusEffect  , useRoute} from '@react-navigation/native';
import {COLOR} from '../../../../../res/variables';

//SELF IMPORTS
import {Header, HeaderSearchField, Menu, Advertisements} from './Components';

const Screen = ({navigation, constants}) => {
  // const userLocation = {
  //   latitude,
  //   longitude,
  //   formattedAddress,
  //   formattedAddressHash
  // }
  useFocusEffect(useCallback(()=>{
    if(Platform.OS == "android")  FlagSecure.deactivate();   
  },[]))
 
  const [userLocation, setUserLocation] = useState(null);

  const onNotificationOpened = ({notification}) => {
    try {
      if (notification.additionalData.classification === 'toktokwallet') {
        setTimeout(() => {
          // navigation.navigate('ToktokWalletHomePage');
          // navigation.replace('ToktokWalletHomePage');
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

    // const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
    //   return true;
    // });
    return () => {
      // backHandler.remove();
    };
  }, []);

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
        <Advertisements Header={Header}  HeaderSearchField={HeaderSearchField} Menu={Menu} setUserLocation={setUserLocation} constants={constants} />
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
