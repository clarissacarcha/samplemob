import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, StatusBar, ScrollView} from 'react-native';
import {COLOR} from '../../../../res/variables';

//SELF IMPORTS
import {Header, Menu, Advertisements} from './Components';

const ConsumerLanding = () => {
  // const userLocation = {
  //   latitude,
  //   longitude,
  //   formattedAddress,
  //   formattedAddressHash
  // }

  const [userLocation, setUserLocation] = useState(null);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent />
      <SafeAreaView style={styles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header />
          <Menu setUserLocation={setUserLocation} />
          <Advertisements />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ConsumerLanding;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
  },
});
