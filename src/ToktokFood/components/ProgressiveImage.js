/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {Animated} from 'react-native';

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
      <Animated.Image
        source={placeholder}
        resizeMode="cover"
        style={{
          resizeMode: 'cover',
          opacity: defaultImageAnimated,
          ...style,
        }}
        onLoad={handleDefaultImageLoad}
        blurRadius={1}
      />
      <Animated.Image
        source={{uri: source}}
        resizeMode="cover"
        style={{
          resizeMode: 'cover',
          opacity: imageAnimated,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          ...style,
        }}
        onLoad={handleImageLoad}
      />
    </React.Fragment>
  );
};

export default React.memo(ProgressiveImage);
