import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import SplashImage from '../assets/images/toktokmall-splash-screen.png';

const imageWidth = Dimensions.get('window').width;
const imageHeight = Dimensions.get('window').height;


const Splash = ({ createMyCartSession}) => {
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('MyCart').then((value) => {
      console.log('cart async storage',value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createMyCartSession('set', parsedValue)
        navigation.navigate("ToktokMallLanding");

      }else {
        createMyCartSession('set', [])
        navigation.navigate("ToktokMallLanding");
      }
    })
  }, []);


  return (
    <View style = {{flex: 1, justifyContent:'center', alignItems: 'center'}}>
      <Image source = {SplashImage} style = {{height: imageHeight, width: imageWidth }} resizeMode="cover" />
    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
});

export default connect(null, mapDispatchToProps)(Splash);

