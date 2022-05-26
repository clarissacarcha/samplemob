import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, Dimensions, Animated, TouchableOpacity} from 'react-native';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//IMAGES && COLOR
import {onboarding_2, onboarding_toktokbills} from 'toktokbills/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

const {width, height} = Dimensions.get('window');

export const PageTwo = ({scale}) => {
  return (
    <Animated.View style={{...styles.container, transform: [{scale: scale}]}}>
      <Image resizeMode="contain" style={styles.logo} source={onboarding_toktokbills} />
      <Image resizeMode="contain" style={styles.welcomeImage} source={onboarding_2} />
      <Text style={styles.title}>
        <Text style={styles.title}>Select toktok</Text>
        <Text style={styles.wallet}>wallet</Text>
      </Text>
      <Text style={styles.message}>
        To proceed to the next step, you must first pay your bills using your toktokwallet account.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'transparent',
    width: width,
    alignItems: 'center',
  },
  title: {
    marginBottom: moderateScale(20),
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(20),
    color: COLOR.ORANGE,
    textAlign: 'center',
  },
  wallet: {
    marginBottom: moderateScale(20),
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(20),
    color: COLOR.YELLOW,
    textAlign: 'center',
  },
  welcomeImage: {
    height: width * 0.8,
    width: width * 0.8,
    marginVertical: 10,
  },
  logo: {
    height: moderateScale(50),
    width: moderateScale(150),
    marginVertical: 10,
  },
  message: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.L,
    textAlign: 'center',
    marginHorizontal: moderateScale(20),
  },
});
