import React from 'react';

import {StyleSheet, Image, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {getDeviceWidth, isIphoneXorAbove, scale} from 'toktokfood/helper/scale';

export const FoodImageSlider = (props) => {
  const {images} = props;

  const FoodImages = ({item, index}) => {
    return <Image style={styles.imageBanner} source={{uri: item}} resizeMode="cover" />;
  };

  return (
    <>
      <View style={styles.container}>
        <Carousel
          loop={true}
          autoplay={true}
          data={images}
          autoplayInterval={3000}
          sliderWidth={getDeviceWidth}
          itemWidth={getDeviceWidth - 25}
          renderItem={FoodImages}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    width: scale(345),
    height: scale(180),
    paddingVertical: Platform.OS === 'ios' && isIphoneXorAbove() ? 2 : 12,
  },
  imageBanner: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
