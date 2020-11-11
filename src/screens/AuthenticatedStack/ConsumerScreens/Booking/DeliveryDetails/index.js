import React, {useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableHighlight} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Overlay} from 'react-native-maps';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {COLOR, DARK, MAP_DELTA} from '../../../../../res/constants';
import {reverseGeocode} from '../../../../../helper';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

const SearchMap = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Details']} />,
  });

  return <View style={styles.container}></View>;
};

export default SearchMap;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    height: 50,
    margin: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  floatingPin: {
    // ...StyleSheet.absoluteFillObject,
    // justifyContent: 'center',
    // alignItems: 'center',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // top: 0
  },
  submitBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    margin: 20,
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
