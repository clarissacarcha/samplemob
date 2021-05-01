import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {FocusAwareStatusBar} from '../../../../revamp/ui/';
import {COLORS} from '../../../../res/constants';

//SELF IMPORTS
import Greeting from './Greeting';
import Header from './Header';
import Menu from './Menu';
import {StatusBar} from 'react-native';

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
      <SafeAreaView>
        <View style={styles.screenBox}>
          <Header />
          {/* <Greeting /> */}
          <Menu setUserLocation={setUserLocation} />
          {/* <Text>{JSON.stringify(userLocation, null, 4)}</Text> */}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ConsumerLanding;

const styles = StyleSheet.create({
  screenBox: {
    backgroundColor: 'white',
    marginTop: StatusBar.currentHeight,
  },
});
