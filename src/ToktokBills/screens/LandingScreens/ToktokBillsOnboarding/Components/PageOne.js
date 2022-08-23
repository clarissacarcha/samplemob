import React, {useState} from 'react';
import {View, Text, Image, Animated} from 'react-native';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//IMAGES && COLOR
import {onboarding_1, onboarding_toktokbills} from 'toktokbills/assets';

//STYLES
import {styles} from '../styles';

export const PageOne = ({scale}) => {
  return (
    <Animated.View style={{...styles.container, transform: [{scale: scale}]}}>
      <Image resizeMode="contain" style={styles.onboardingImage1} source={onboarding_1} />
      <Text style={styles.title}>Select a Biller</Text>
      <Text style={styles.message}>
        Enjoy the convenience of paying bills on time by choosing to our plenty of partner billers.
      </Text>
    </Animated.View>
  );
};
