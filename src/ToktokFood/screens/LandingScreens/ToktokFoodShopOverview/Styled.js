/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Animated, ImageBackground, View} from 'react-native';
import styled from 'styled-components/native';
import PagerView from 'react-native-pager-view';
import Header from 'toktokfood/components/Header';
import {Icon} from 'react-native-elements';
import StyledText from 'toktokfood/components/StyledText';
import SearchBar from 'toktokfood/components/SearchBar';

// Assets
import {starbucks_banner} from 'toktokfood/assets/images';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;

export const BodyContainer: ComponentType<any> = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

export const ScrollContainer: ComponentType<any> = styled(Animated.ScrollView).attrs(props => ({
  ...props,
  // stickyHeaderIndices: [1.0],
  contentContainerStyle: {
    paddingTop: 350,
    // height: '1000%',
    // flex: 1,
  },
  // contentOffset: {x: 0, y: 100},
}))`
  border-width: 1px;
  position: absolute;
  /* top: 50px; */
  /* flex: 1; */
  height: 100%;
  /* flex: 1; */
  /* padding-top: 250px; */
`;

// Searchbar
export const SearchBox: ComponentType<any> = styled(SearchBar).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
}))`
  /* margin-bottom: 20px; */
  /* width: 100%; */
  flex: 1;
`;

// Pager
export const Pager: ComponentType<any> = styled(PagerView).attrs(props => ({
  ...props,
  initialPage: 0,
  orientation: 'vertical',
  scrollEnabled: false,
}))`
  flex: 1;
`;

export const PageView: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
  // collapsable: Platform.OS === 'ios' ? true : false,
}))`
  flex: 1;
  /* border-width: 1px; */
  /* padding-top: 100px; */
`;

// Animated
export const AnimatedHeader: ComponentType<any> = styled(Animated.View).attrs(props => ({
  ...props,
}))`
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
  /* border-bottom-width: 0; */
  background-color: white;
`;

export const AnimatedImageHeader: ComponentType<any> = styled(Animated.View).attrs(props => ({
  ...props,
}))`
  position: absolute;
  top: 0;
  width: 100%;
  height: ${(props) => props.scrollAnimation[0]}px;
`;

export const ImageBg: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: props.source ? {uri: props.source} : starbucks_banner,
  // resizeMethod: 'cover',
}))`
  height: 320px;
`;

export const ImageHeader: ComponentType<any> = styled(Header).attrs(props => ({
  ...props,
  containerStyle: {
    borderBottomWidth: 0,
  },
  // color: props.theme.color.white,
}))``;

export const BackButton: ComponentType<any> = styled(Icon).attrs(props => ({
  ...props,
  name: 'chevron-back-outline',
  type: 'ionicon',
  color: props.color,
  size: 26,
}))``;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  text-align: center;
`;
