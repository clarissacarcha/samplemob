import React from 'react';

import {StyleSheet, Image, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {getDeviceWidth, isIphoneXorAbove, scale} from 'toktokfood/helper/scale';

import ContentLoader from 'react-native-easy-content-loader';

export const FoodImageSlider = (props) => {
  const {images} = props;

  console.log(images);

  const BannerPlaceHolder = () => {
    return (
      <View
        style={{
          marginTop: scale(50),
          position: 'absolute',
          alignSelf: 'center',
          height: scale(140),
          width: scale(350),
        }}>
        <ContentLoader
          active
          pRows={1}
          pHeight="100%"
          pWidth="100%"
          title={false}
          primaryColor="rgba(256,186,28,0.2)"
          secondaryColor="rgba(256,186,28,0.7)"
        />
      </View>
    );
  };

  const FoodImages = ({item, index}) => {
    return <Image style={styles.imageBanner} source={{uri: item.filename}} resizeMode="cover" />;
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
