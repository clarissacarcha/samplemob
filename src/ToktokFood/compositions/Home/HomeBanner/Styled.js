/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Image} from 'react-native';

import styled from 'styled-components/native';

import {SliderBox} from 'react-native-image-slider-box';

import {getDeviceWidth} from 'toktokfood/helper/scale';

export const Container: ComponentType<any> = styled.View`
  padding-vertical: 10px;
  padding-top: 10px;
  padding-left: 15px;
  background-color: ${props => props.theme.color.white};
  /* height: 200px; */
  /* align-items: center; */
  flex: 1;
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
