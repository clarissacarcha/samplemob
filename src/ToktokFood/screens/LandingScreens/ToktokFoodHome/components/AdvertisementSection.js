import React from 'react';
import {View, StyleSheet, Image, Platform, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import {starbucks, starbucks2, yellow_cab} from 'toktokfood/assets/images';

// Utils
import {getDeviceWidth, isIphoneXorAbove} from 'toktokfood/helper/scale';

import {useNavigation} from '@react-navigation/native';

const AdvertisementSection = () => {
  const navigation = useNavigation();

  const temp_banners = [{shop_banner: starbucks}, {shop_banner: starbucks2}, {shop_banner: yellow_cab}];

  const onRestaurantNavigate = (index) => {
    console.log(index);
    if (index !== 5) {
      navigation.navigate('ToktokFoodRestaurantOverview', {
        item: {
          distance: '1km',
          id: 1,
          image: 36,
          name: 'Starbucks (32nd Street)',
          ratings: 5,
          time: '40 mins',
          totalBranches: 4,
        },
      });
    } else {
      navigation.navigate('ToktokFoodRestaurantOverview', {
        item: {
          distance: '2.1km',
          id: 2,
          image: 37,
          name: 'Yellow Cab (32nd Street)',
          ratings: 5,
          time: '40 mins',
          totalBranches: 4,
        },
      });
    }
  };

  const AdvertisementItem = ({item, index}) => (
    <TouchableOpacity onPress={() => onRestaurantNavigate(index)}>
      <Image style={styles.imageBanner} source={item.shop_banner} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Carousel
        loop={true}
        autoplay={true}
        data={temp_banners}
        autoplayInterval={3000}
        sliderWidth={getDeviceWidth}
        itemWidth={getDeviceWidth - 25}
        renderItem={AdvertisementItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    paddingVertical: Platform.OS === 'ios' && isIphoneXorAbove() ? 2 : 12,
  },
  imageBanner: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

export default AdvertisementSection;
