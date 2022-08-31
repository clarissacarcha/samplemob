/**
 * @flow
 */

import type {ComponentType} from 'react';
import {ActivityIndicator, Animated, ImageBackground, NativeModules, Platform} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
// import {Avatar} from 'react-native-elements';
import styled from 'styled-components/native';

import StyledText from 'toktokfood/components/StyledText';

import {getDeviceHeight} from 'toktokfood/helper/scale';
import {reseller_badge} from 'toktokfood/assets/images';

const {StatusBarManager} = NativeModules;
const headerHeight = Platform.OS === 'ios' ? 50 : 50 + StatusBarManager.HEIGHT;

export const Column: ComponentType<any> = styled.View`
  flex: ${props => props.flex || 1};
  padding-horizontal: 7px;
`;

export const ContentContainer: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.color.white};
  flex: 1;
  padding-horizontal: 10px;
  padding-top: 420px;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  flex: 1;
`;

export const ItemContainer: ComponentType<any> = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 15px;
  padding-horizontal: 15px;
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
  padding-horizontal: 15px;
  padding-top: 15px;
`;

// Loader
export const LoaderContainer: ComponentType<any> = styled.View`
  flex: 1;
  padding-vertical: 20;
  /* height: 30px; */
`;

export const Loader: ComponentType<any> = styled(ActivityIndicator).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
  size: 'large',
}))`
  /* padding-top: 450px; */
`;

// Animated FlatList
export const AnimatedList: ComponentType<any> = styled(Animated.FlatList).attrs(props => ({
  ...props,
  showsVerticalScrollIndicator: false,
  scrollToOverflowEnabled: true,
  scrollEventThrottle: 16,
  contentContainerStyle: {
    backgroundColor: props.theme.color.white,
    paddingTop: 350 + headerHeight,
    // paddingHorizontal: 15,
    minHeight: getDeviceHeight + 300,
    // minHeight: getDeviceHeight + (props.totalItems < 9 ? 300 : 400),
  },
  onEndReachedThreshold: 0.2,
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

// Loader
export const ContentLoading: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  active: true,
  title: false,
  pRows: 3,
  pHeight: [10, 10, 15],
  pWidth: ['40%', '80%', '30%'],
  // primaryColor: props.theme.color.yellow,
  // secondaryColor: 'rgba(256,186,28,0.4)',
  aShape: 'square',
  aSize: 'large',
  avatar: true,
  listSize: 5,
  // loading: false,
}))`
  padding-top: 400px;
`;
