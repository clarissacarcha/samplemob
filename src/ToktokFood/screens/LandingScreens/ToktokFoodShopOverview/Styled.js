/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Animated, ImageBackground, View} from 'react-native';
import styled from 'styled-components/native';
import PagerView from 'react-native-pager-view';

import SearchBar from 'toktokfood/components/SearchBar';

// Assets
import {starbucks_banner} from 'toktokfood/assets/images';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
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
  /* width: 300; */
  /* flex: 10; */
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
`;

export const AnimatedImageHeader: ComponentType<any> = styled(Animated.View).attrs(props => ({
  ...props,
}))`
  position: absolute;
  top: 0;
  width: 100%;
  height: 350px;
`;

export const ImageBg: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: props.source ? {uri: props.source} : starbucks_banner,
  resizeMethod: 'cover',
}))`
  height: 320px;
`;
