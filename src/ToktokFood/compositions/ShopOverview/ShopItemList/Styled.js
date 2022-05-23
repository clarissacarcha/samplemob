/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Animated, ImageBackground} from 'react-native';
// import {Avatar} from 'react-native-elements';
import styled from 'styled-components/native';

import StyledText from 'toktokfood/components/StyledText';

import {getDeviceHeight} from 'toktokfood/helper/scale';
import {reseller_badge} from 'toktokfood/assets/images';

export const Column: ComponentType<any> = styled.View`
  flex: ${props => props.flex || 1};
  padding-horizontal: 7px;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  flex: 1;
`;

export const ItemContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 15px;
  width: 100%;
`;

export const PromoTag: ComponentType<any> = styled.View`
  align-self: flex-start;
  align-items: center;
  background-color: ${props => props.theme.color.yellow};
  height: 24px;
  justify-content: center;
  margin-right: 10px;
  /* padding-vertical: 2px; */
  padding-horizontal: 8px;
`;

export const TagContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  flex: 1;
  margin-top: 7px;
`;

export const TitleContainer: ComponentType<any> = styled.View`
  padding-vertical: 10px;
  padding-top: 20px;
`;

export const AnimatedList: ComponentType<any> = styled(Animated.FlatList).attrs(props => ({
  ...props,
  showsVerticalScrollIndicator: false,
  scrollToOverflowEnabled: true,
  scrollEventThrottle: 16,
  contentContainerStyle: {
    backgroundColor: props.theme.color.white,
    paddingTop: 350 + 50,
    paddingHorizontal: 15,
    minHeight: getDeviceHeight + (props.totalItems < 9 ? 300 : 400),
  },
}))``;

// Custom Image
export const ResellerTag: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: reseller_badge,
  resizeMode: 'contain',
  imageStyle: {
    height: 24,
    // width: 200
  },
}))`
  justify-content: center;
  padding-horizontal: 8px;
  padding-bottom: 5px;
`;

// Custom Text
export const Pricetext: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
  mode: 'semibold',
}))`
  flex: 1;
`;

export const PromoText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.white,
  mode: 'semibold',
  fontSize: 11,
  textProps: {
    numberOfLines: 1,
  },
}))``;

export const Description: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  textProps: {numberOfLines: 1},
}))`
  margin-top: 5px;
`;
