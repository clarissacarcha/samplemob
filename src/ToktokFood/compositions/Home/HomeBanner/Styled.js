/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Image} from 'react-native';

import styled from 'styled-components/native';

import {SliderBox} from 'react-native-image-slider-box';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {getDeviceWidth} from 'toktokfood/helper/scale';

export const Container: ComponentType<any> = styled.View`
  padding-top: 20px;
  padding-left: 15px;
  /* padding: 20px; */
  background-color: ${props => props.theme.color.white};
  /* height: 200px; */
  /* align-items: center; */
  /* flex: 1; */
`;

export const BannerImage: ComponentType<any> = styled.Image`
  height: 130px;
  width: 100%;
  resize-mode: stretch;
`;

export const Banner: ComponentType<any> = styled(SliderBox).attrs(props => ({
  ...props,
  sliderBoxHeight: 100,
  // sliderWidth: getDeviceWidth,
  circleLoop: true,
  autoplay: true,
  parentWidth: getDeviceWidth - 30,
  // resizeMode: 'contain',
  // resizeMethod: 'contain',
  // imageComponentStyle: {
  //   resizeMode: 'contain',
  // },
}))``;

export const BannerImg: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
}))`
  border-radius: 12px;
`;

export const Slider: ComponentType<any> = styled(Carousel).attrs(props => ({
  ...props,
  sliderWidth: getDeviceWidth - 30,
  itemWidth: getDeviceWidth - 30,
  loop: true,
  autoplay: true,
  enableMomentum: false,
  lockScrollWhileSnapping: true,
  autoplayInterval: 5000,
}))``;

export const Dots: ComponentType<any> = styled(Pagination).attrs(props => ({
  ...props,
  inactiveDotScale: 1,
  inactiveDotOpacity: 1,
  inactiveDotStyle: {
    backgroundColor: 'transparent',
    borderColor: props.theme.color.white,
    borderWidth: 1,
  },
  dotStyle: {
    backgroundColor: props.theme.color.white,
    width: 8,
    height: 8,
  },
  containerStyle: {position: 'absolute', bottom: -20, alignSelf: 'center'},
}))``;
