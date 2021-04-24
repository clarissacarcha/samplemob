import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

//SELF IMPORTS
import Greeting from './Greeting';
import Header from './Header';
import Menu from './Menu';

const ConsumerLanding = () => {
  // const userLocation = {
  //   latitude,
  //   longitude,
  //   formattedAddress,
  //   formattedAddressHash
  // }

  const [userLocation, setUserLocation] = useState(null);

  return (
    <View style={styles.screenBox}>
      <Header />
      <Greeting />
      <Menu setUserLocation={setUserLocation} />
      <Text>{JSON.stringify(userLocation, null, 4)}</Text>
    </View>
  );
};

export default ConsumerLanding;

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});
