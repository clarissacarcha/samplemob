import React, {useState} from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar} from 'react-native';
import GradientBackground from '../../../assets/toktokgo/BackGroundBeta.png';
import constants from '../../../common/res/constants';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {EnjoyYourRide, FindDriver, StartBooking} from './Section';
const ToktokGoOnBoardingBeta = ({navigation}) => {
  const [screen, setsSreen] = useState(1);
  const onPress = async () => {
    const data = moment(new Date()).format('MMM D, YYYY');
    const date = await AsyncStorage.getItem('ToktokGoHealthCare');
    AsyncStorage.setItem('ToktokGoOnBoardingBeta', data);

    if (date === moment(new Date()).format('MMM D, YYYY')) {
      navigation.replace('ToktokGoBookingStart');
    } else {
      navigation.replace('ToktokGoHealthCare');
    }
  };
  return (
    <ImageBackground source={GradientBackground} style={styles.container}>
      {screen === 1 && <StartBooking />}
      {screen === 2 && <FindDriver />}
      {screen === 3 && <EnjoyYourRide />}
      {screen === 3 ? (
        <TouchableOpacity
          style={{
            backgroundColor: constants.COLOR.ORANGE,
            marginHorizontal: 80,
            paddingVertical: 10,
            borderRadius: 5,
            marginTop: 32,
          }}
          onPress={onPress}>
          <Text
            style={{
              color: constants.COLOR.WHITE,
              fontSize: constants.FONT_SIZE.XL - 1,
              fontFamily: constants.FONT_FAMILY.BOLD,
              textAlign: 'center',
            }}>
            Get Started
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{marginHorizontal: 45, marginTop: 53, alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={() => setsSreen(screen + 1)}>
            <Text
              style={{
                color: constants.COLOR.ORANGE,
                fontSize: constants.FONT_SIZE.XL - 1,
                fontFamily: constants.FONT_FAMILY.BOLD,
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
};

export default ToktokGoOnBoardingBeta;
