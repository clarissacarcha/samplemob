import React, {useState, Fragment} from 'react';

import {StyleSheet, Image, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {getDeviceWidth, scale} from 'toktokfood/helper/scale';
import ImageLoader from './ImageLoader';

export const FoodImageSlider = props => {
  const [isLoading, setIsLoading] = useState(true);
  const {images} = props;

  const FoodImages = ({item, index}) => {
    return (
      <Fragment>
        <ImageLoader loaded={isLoading === false} />
        <Image
          onLoadEnd={() => setIsLoading(false)}
          style={styles.imageBanner}
          source={{uri: item.filename}}
          resizeMode="cover"
        />
      </Fragment>
    );
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    width: scale(345),
    height: scale(190),
  },
  imageBanner: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
