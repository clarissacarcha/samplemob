import React, {useState} from 'react';
import {View, Text, Image, Animated} from 'react-native';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//IMAGES && COLOR
import {onboarding_4, onboarding_toktokbills} from 'toktokbills/assets';

//STYLES
import {styles} from '../styles';

export const PageFour = ({scale}) => {
  return (
    <Animated.View style={{...styles.container, transform: [{scale: scale}]}}>
      <Image resizeMode="contain" style={styles.onboardingImage1} source={onboarding_4} />
      <Text style={styles.title}>Received Receipt</Text>
      <Text style={styles.message}>
        There will be a downloadable receipt, which will also be sent to your email account.
      </Text>
    </Animated.View>
  );
};
