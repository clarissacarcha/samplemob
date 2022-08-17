import React, {useState} from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar} from 'react-native';
import GradientBackground from '../../../assets/toktokgo/toktokgo-gradient-background.png';
import constants from '../../../common/res/constants';

import ToktokGoMaintanceLogo from '../../../assets/images/ToktokGoMaintenaceLogo.png';
import ToktokGoMaintanceImage from '../../../assets/images/ToktokGoMaintanceImage.png';

const ToktokGoMaintance = ({navigation}) => {
  return (
    <ImageBackground source={GradientBackground} style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <View style={{marginTop: StatusBar.currentHeight + 120}}>
          <Image source={ToktokGoMaintanceLogo} resizeMode={'contain'} style={{height: 30, width: 131}} />
        </View>
        <Image
          source={ToktokGoMaintanceImage}
          resizeMode={'contain'}
          style={{height: 255, width: 300, marginTop: 30}}
        />
        <View style={{alignItems: 'center', marginHorizontal: 20}}>
          <Text
            style={{
              color: constants.COLOR.ORANGE,
              fontFamily: constants.FONT_FAMILY.BOLD,
              fontSize: constants.FONT_SIZE.XL + 1,
              marginTop: 25,
            }}>
            Katok ka ulit mamaya!
          </Text>
          <Text style={{fontSize: constants.FONT_SIZE.M, textAlign: 'center', marginTop: 8}}>
            We are performing some maintenance to serve you better. We will be right back. Thank you.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ToktokGoMaintance;
