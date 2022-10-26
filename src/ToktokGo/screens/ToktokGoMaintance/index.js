import React, {useState} from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar} from 'react-native';
import GradientBackground from '../../../assets/toktokgo/toktokgo-gradient-background.png';
import constants from '../../../common/res/constants';

import ToktokGoMaintanceLogo from '../../../assets/images/ToktokGoMaintenaceLogo.png';
import ToktokGoMaintanceImage from '../../../assets/images/ToktokGoMaintanceImage.png';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {ThrottledOpacity} from '../../../components_section';

const ToktokGoMaintance = ({navigation}) => {
  return (
    <ImageBackground source={GradientBackground} style={styles.container}>
      <ThrottledOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </ThrottledOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 17,
    left: 10,
    padding: 17,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
});
