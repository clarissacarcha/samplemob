import React, {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, StatusBar, ScrollView, RefreshControl} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {COLOR} from '../../../../../res/variables';

//SELF IMPORTS
import {Header, Menu, Advertisements} from './Components';

export const ToktokLandingHome = ({navigation}) => {
  // const userLocation = {
  //   latitude,
  //   longitude,
  //   formattedAddress,
  //   formattedAddressHash
  // }

  const [userLocation, setUserLocation] = useState(null);

  const onNotificationOpened = ({notification}) => {
    try {

      console.log("Notification", JSON.stringify(notification))

      if (notification.additionalData.classification === 'toktokwallet') {
        setTimeout(() => {
          navigation.navigate('ToktokWalletHomePage');
        }, 10);
        return;
      }else if (notification.additionalData.classification === 'toktokmall') {
        setTimeout(() => {
          navigation.navigate('ToktokMallSplashScreen');
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
      <SafeAreaView style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl
          //     colors={[COLOR.YELLOW]}
          //     refreshing={false}
          //     onRefresh={() => {
          //       console.log('REFRESHED');
          //     }}
          //   />
          // }
        >
          <Header />
          <Menu setUserLocation={setUserLocation} />
          <Advertisements />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
  },
});
