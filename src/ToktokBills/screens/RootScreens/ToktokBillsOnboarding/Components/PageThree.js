import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, Dimensions, Animated, TouchableOpacity} from 'react-native';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//IMAGES && COLOR
import {onboarding_3, onboarding_toktokbills} from 'toktokbills/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

const {width, height} = Dimensions.get('window');

export const PageThree = ({scale}) => {
  return (
    <Animated.View style={{...styles.container, transform: [{scale: scale}]}}>
      <Image resizeMode="contain" style={styles.welcomeImage} source={onboarding_3} />
      <Text style={styles.title}>Review and Confirm</Text>
      <Text style={styles.message}>
        Before you click the confirm button, double-check all of the information you've provided.
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
    flex: 1,
    justifyContent: 'center', 
  },
  title: {
    marginBottom: moderateScale(20),
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(30),
    color: COLOR.ORANGE,
    textAlign: 'center',
  },
  welcomeImage: {
    height: null,
    aspectRatio: 1.1,
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
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginHorizontal: moderateScale(20),
  },
});
