/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import {useQuery} from '@apollo/client';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import type {PropsType} from './types';
import {Container, BannerImage, Slider, Dots} from './Styled';

import {starbucks, burger_king, yellow_cab, banner_1} from 'toktokfood/assets/images';
import {getDeviceWidth} from 'toktokfood/helper/scale';

import {GET_SHOP_BANNERS} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

const HomeBanner = (props: PropsType): React$Node => {
  const [imageBanners, setImageBanners] = useState([banner_1, starbucks, yellow_cab, burger_king]);
  const [activeSlide, setActiveSlide] = useState(0);

  // fetch data in categoties
  const {loading} = useQuery(GET_SHOP_BANNERS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getShopBanners}) => {
      const banners = getShopBanners?.map(banner => banner.filename);
      setImageBanners(banners);
    },
  });

  const Loader = () => (
    <SkeletonPlaceholder backgroundColor="rgba(220, 220, 220, 1)">
      <SkeletonPlaceholder.Item paddingVertical={10} alignItems="center" marginRight={15} height={130} />
    </SkeletonPlaceholder>
  );

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
      {loading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <Slider
            data={imageBanners}
            renderItem={({item}) => <BannerImage source={{uri: item}} />}
            onSnapToItem={index => setActiveSlide(index)}
          />
          <Dots dotsLength={imageBanners.length} activeDotIndex={activeSlide} />
        </React.Fragment>
      )}
    </Container>
  );
};

export default HomeBanner;
