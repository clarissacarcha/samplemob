import React from 'react';
import {View, Image} from 'react-native';

import HeaderImage from '../../assets/toktok/images/HeaderBackground.png';

export const ImageHeader = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <Image style={{height: 220}} source={HeaderImage} resizeMode="cover" />
    </View>
  );
};
