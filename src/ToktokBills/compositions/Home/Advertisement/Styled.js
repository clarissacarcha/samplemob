/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import {FlatList} from 'react-native';
import styled from 'styled-components/native'
import {moderateScale} from 'toktokbills/helper';
import FastImage from 'react-native-fast-image';
const { width , height } = Dimensions.get("window")

// export const Container: ComponentType<any> = styled.View``;
export const LogoImage: ComponentType<any> = styled(FastImage).attrs(props => ({
   ...props,
}))`
  height: ${width * .32};
  width: ${width}
`;
export const Display: ComponentType<any> = styled.View`
  flex: 1;
`;
export const Container: ComponentType<any> = styled.View`
  height: ${width * .32};
`;
export const LoadingContainer: ComponentType<any> = styled.View`
  background-color: rgba(255, 235, 189, 0.45),
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  border-radius: ${moderateScale(10)}px;
`;
export const List: ComponentType<any> = styled(FlatList).attrs(props => ({
   ...props,
}))`
   height: ${width * .32};
`;
export const Slide: ComponentType<any> = styled(Carousel).attrs(props => ({
   ...props,
   sliderWidth: width,
   sliderHeight: height * 0.15,
   itemWidth: width
}))``;
