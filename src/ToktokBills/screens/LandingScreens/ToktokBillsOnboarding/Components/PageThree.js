import React, {useState} from 'react';
import {View, Text, Image, Animated} from 'react-native';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//IMAGES && COLOR
import {onboarding_3, onboarding_toktokbills} from 'toktokbills/assets';

//STYLES
import {styles} from '../styles';

export const PageThree = ({scale}) => {
  return (
    <Animated.View style={{...styles.container, transform: [{scale: scale}]}}>
      <Image resizeMode="contain" style={styles.onboardingImage1} source={onboarding_3} />
      <Text style={styles.title}>Review and Confirm</Text>
      <Text style={styles.message}>
        Before you click the confirm button, double-check all of the information you've provided.
      </Text>
    </Animated.View>
  );
};
