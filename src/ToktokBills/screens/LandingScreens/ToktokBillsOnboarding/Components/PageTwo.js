import React, {useState} from 'react';
import {View, Text, Image, Animated} from 'react-native';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//IMAGES && COLOR
import {onboarding_2, onboarding_toktokbills} from 'toktokbills/assets';

//STYLES
import {styles} from '../styles';

export const PageTwo = ({scale}) => {
  return (
    <Animated.View style={{...styles.container, transform: [{scale: scale}]}}>
      <Image resizeMode="contain" style={styles.onboardingImage2} source={onboarding_2} />
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
