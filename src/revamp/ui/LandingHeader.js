import React from 'react';
import {View, Image, ImageBackground} from 'react-native';

import HeaderImage from '../../assets/toktok/images/HeaderBackground.png';

export const ImageHeader = ({children}) => {
  return (
    <ImageBackground style={{height: 110}} source={HeaderImage} resizeMode="cover">
      {children}
    </ImageBackground>
  );
};
