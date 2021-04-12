import React from 'react';
import {View, StyleSheet} from 'react-native';

//SELF IMPORTS
import Greeting from './Greeting';
import Header from './Header';
import Menu from './Menu';

const ConsumerLanding = () => {
  return (
    <View style={styles.screenBox}>
      <Header />
      <Greeting />
      <Menu />
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
