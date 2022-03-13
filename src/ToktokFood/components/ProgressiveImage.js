/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {Animated} from 'react-native';
import FastImage from 'react-native-fast-image' 

const ProgressiveImage = ({placeholder, source, style}) => {
  const defaultImageAnimated = useRef(new Animated.Value(0)).current;
  const imageAnimated = useRef(new Animated.Value(0)).current;

  const settings = {
    toValue: 1,
    useNativeDriver: true,
    duration: 500,
  };

  const handleDefaultImageLoad = () => Animated.timing(defaultImageAnimated, settings).start();
  const handleImageLoad = () => Animated.timing(imageAnimated, settings).start();

  return (
    <React.Fragment>
      <FastImage
        source={placeholder}
        resizeMode={FastImage.resizeMode.cover}
        style={{
          ...style,
        }}
      />
      <FastImage
        source={{uri: source}}
        resizeMode={FastImage.resizeMode.cover}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          ...style,
        }}
      />
    </React.Fragment>
  );
};

export default React.memo(ProgressiveImage);
