/**
 * @format
 * @flow
 */

import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';

import type {PropsType} from './types';
import {Container} from './Styled';

import {starbucks, burger_king, yellow_cab, banner_1} from 'toktokfood/assets/images';
import {getDeviceWidth} from 'toktokfood/helper/scale';

const HomeBanner = (props: PropsType): React$Node => {
  const imageBanners = [banner_1, starbucks, yellow_cab, burger_king];

  // const temp_banners = [
  //   {shop_banner: banner_1},
  //   {shop_banner: starbucks},
  //   {shop_banner: yellow_cab},
  //   {shop_banner: burger_king},
  // ];

  // const AdvertisementItem = ({item, index}) => (
  //   <TouchableOpacity>
  //     <BannerImg source={item.shop_banner} resizeMode="cover" />
  //   </TouchableOpacity>
  // );

  return (
    <Container>
      <SliderBox
        images={imageBanners}
        sliderBoxHeight={180}
        circleLoop={3000}
        autoplay={true}
        parentWidth={getDeviceWidth - 30}
        resizeMode="cover"
      />
    </Container>
  );
};

export default HomeBanner;
